import { request } from 'undici';
import type { Shard } from '../../Shard';
import type { UserDatabase } from '../../database/models';
import type { TokenRefreshData, PatreonData, UserPatronData } from '../interfaces/Patreons';

export class Patreon {
  private readonly client: Shard;
  private readonly db: UserDatabase;
  private readonly clientId: string;
  private readonly clientSecret: string;
  private accessToken: string;
  private refreshToken: string;
  private expires: number;

  constructor(client: Shard) {
    this.client = client;
    this.db = this.client.db.user;
    this.clientId = this.client.config.patreon.clientId;
    this.clientSecret = this.client.config.patreon.clientSecret;
    this.refreshToken = this.client.config.patreon.refreshToken;
    this.accessToken = this.client.config.patreon.accessToken;
    this.expires = null;

    setInterval(this.fetchPatreon.bind(this), 100 * 60 * 2);
  }

  get allowedToRequest() {
    return this.client.shards.get(0).id === 1;
  }

  private async fetchPatreon(url?: string) {
    if (!this.allowedToRequest || this.client.botInstance !== 'production') return;
    const body = await this.fetchPatrons(url);
    const updateUsers: UserPatronData[] = [];

    for (const patron of body.included) {
      if (patron.type !== 'user') continue;

      const pledgeData = body.data.find(d => d.relationships.user.data.id === patron.id);
      const connections = patron.attributes.social_connections;

      if (!connections || !connections.discord || !connections.discord.user_id) continue;
      if (!pledgeData) continue;
      if (!pledgeData.attributes.last_charge_status || pledgeData.attributes.last_charge_status !== 'Paid' || pledgeData.attributes.currently_entitled_amount_cents === 0) {
        updateUsers.push({
          discordId: connections.discord.user_id,
          patronId: patron.id,
          activeTiers: [],
          hasPremium: false,
        });

        continue;
      }

      const isExisting = await this.db.getUser(connections.discord.user_id);
      if (isExisting) continue;

      const tiers = pledgeData.relationships.currently_entitled_tiers.data;
      const patreonBot = tiers.length > 0 && tiers.find(tier => tier.id === '4210251');
      const premiumFeatures = tiers.length > 0 && tiers.find(tier => tier.id === '7842799');

      updateUsers.push({
        discordId: connections.discord.user_id,
        patronId: patron.id,
        activeTiers: tiers.map(tier => tier.id),
        hasPremium: Boolean(patreonBot) || Boolean(premiumFeatures),
      });

      continue;
    }

    if (updateUsers.length > 0) await this.db.updatePremium(updateUsers);
    if (body.links?.next) await this.fetchPatreon(body.links.next);
  }

  private async fetchPatrons(url?: string): Promise<PatreonData> {
    if (!this.accessToken || this.expires <= Date.now()) {
      try {
        await this.refreshPatreonToken();
      } catch (error) {
        throw new Error(error);
      }
    }

    const response = await request(url
      ? encodeURI(`${url}&include=currently_entitled_tiers,user&fields[member]=full_name,currently_entitled_amount_cents,last_charge_statusfields[tier]=amount_cents,discord_role_ids,patron_count,url&fields[user]=email,full_name,social_connections`)
      : encodeURI('https://www.patreon.com/api/oauth2/v2/campaigns/3525904/members?include=currently_entitled_tiers,user&fields[member]=full_name,currently_entitled_amount_cents,last_charge_status&fields[tier]=amount_cents,discord_role_ids,patron_count,url&fields[user]=email,full_name,social_connections&page[size]=10000'), {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
      },
    }).catch(error => {
      Promise.reject(error);
    });

    if (!response) return;

    const body = await response.body.json();
    return body.data as PatreonData;
  }

  private async refreshPatreonToken() {
    const cacheRefreshToken = await this.client.redis.get('patreon:refreshToken');
    if (cacheRefreshToken) this.refreshToken = cacheRefreshToken;

    let token: TokenRefreshData;
    try {
      token = await this.oauth();
    } catch (error) {
      throw new Error(error);
    }

    this.expires = Date.now() + (Number.parseInt(token.expires_in, 10) * 1000);
    this.accessToken = token.access_token;

    if (token.refresh_token) {
      await this.client.redis.set('patreon:refreshToken', token.refresh_token);
    }

    return true;
  }

  private async oauth(): Promise<TokenRefreshData> {
    const response = await request('https://api.patreon.com/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: `client_id=${this.clientId}&client_secret=${this.clientSecret}&refresh_token=${this.refreshToken}&grant_type='refresh_token'`,
    });

    const body = await response.body.json();
    return body as TokenRefreshData;
  }

  async getData(userId: string) {
    return this.db.getUser(userId);
  }

  async hasPremium(userId: string) {
    if (this.client.config.owners.includes(userId)) return true;
    // fetch staff team

    const userData = await this.getData(userId);
    if (userData) return JSON.parse(JSON.stringify(userData.premium)).hasPremium as boolean;

    return false;
  }
}
