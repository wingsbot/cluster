import {
  APIEmbed,
  InteractionResponseType,
  MessageFlags,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  Routes,
  APIBaseInteraction,
  APIMessageComponentInteraction,
  APIMessageComponentInteractionData,
  InteractionType,
} from 'discord-api-types/v10';
import type { FastifyReply } from 'fastify';
import type { Client } from '../../../../Client';
import { Member, User } from '../..';
import type { REST } from '@discordjs/rest';
import { Message } from '../../Message';

export class ComponentInteraction {
  private restClient: REST;

  private applicationId: string;
  private token: string;

  private id: string;
  private type: number;

  data: APIMessageComponentInteractionData;
  responded = false;
  message: Message;
  channelId: string;
  locale: APIBaseInteraction<InteractionType.MessageComponent, APIMessageComponentInteractionData>['locale'];

  guildId?: string;
  user: User;
  member?: Member;

  constructor(private client: Client, interaction: APIMessageComponentInteraction, private reply: FastifyReply) {
    this.restClient = client.restClient;

    this.applicationId = interaction.application_id;
    this.token = interaction.token;

    this.id = interaction.id;
    this.type = interaction.type;
    this.data = interaction.data;

    this.message = new Message(interaction.message);
    this.user = new User(interaction.user || interaction.member.user);
    this.channelId = interaction.channel_id;
    this.locale = interaction.locale;

    if (interaction.guild_id) this.guildId = interaction.guild_id;
    if (interaction.member) this.member = new Member(interaction.member);
  }

  async sendInteraction(type: number, data: RESTPostAPIInteractionCallbackFormDataBody) {
    let body: RESTPostAPIInteractionFollowupJSONBody;

    try {
      body = await this.reply.status(200).send({
        type,
        data,
      });

      this.responded = true;
    } catch (error) {
      console.log(error);
    }

    return body;
  }

  async send(content: string, options: RESTPostAPIInteractionFollowupJSONBody = {}) {
    const data = Object.assign({ content }, options);

    if (!this.responded) return this.sendInteraction(InteractionResponseType.ChannelMessageWithSource, data);

    return this.restClient.post(
      Routes.webhook(this.applicationId, this.token),
      {
        body: data,
        auth: false,
      },
    ).catch(error => {
      console.error(error);
      return null;
    }) as Promise<RESTPostAPIInteractionFollowupResult>;
  }

  async edit(content: string, options: RESTPostAPIInteractionFollowupJSONBody = {}) {
    const data = Object.assign({ content }, options);

    return this.sendInteraction(InteractionResponseType.UpdateMessage, data);
  }

  async editEmbed(embeds: APIEmbed[] | APIEmbed, ephemeral = false) {
    if (Array.isArray(embeds)) return this.edit('', { embeds, ...ephemeral && { flags: MessageFlags.Ephemeral } });
    return this.send('', { embeds: [embeds] });
  }

  async sendEmbed(embeds: APIEmbed[] | APIEmbed, ephemeral = false) {
    if (Array.isArray(embeds)) return this.send('', { embeds, ...ephemeral && { flags: MessageFlags.Ephemeral } });
    return this.send('', { embeds: [embeds] });
  }

  async success(content: string, ephemeral = false) {
    return this.send(`${this.client.utils.emojis.check} ${content}`, { ...ephemeral && { flags: MessageFlags.Ephemeral } });
  }

  async error(content: string, ephemeral = false) {
    return this.send(`${this.client.utils.emojis.xmark} ${content}`, { ...ephemeral && { flags: MessageFlags.Ephemeral } });
  }
}
