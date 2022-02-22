export interface Config {
  token: string;
  owners: string[];
  contributors: string[];
  botInstance: string;
  mongodb: string;
  wolkeToken: string;
  spotifyClientId: string;
  spotifyClientSecret: string;
  alexToken: string;
  fortnite: string;
  lavalink: {
    nodes: MusicNodes[];
  };

  patreon: {
    clientId: string;
    clientSecret: string;
    refreshToken: string;
    accessToken: string;
  };

  shards: number;
  clusters: number;
  errorWebhook: string;
  guildWebhook: string;
  webhook: string;
  patreonWebhook: string;
  prodBot: string;
  dblToken: string;
  dbotsToken: string;
  otherToken: string;
  prodPassword: string;
}

export interface MusicNodes {
  host: string;
  port: number;
  restPort: number;
  region: string;
  password: string;
}

export interface StartMessage {
  shards: number[];
  totalShards: number;
  clusterId: number;
}
