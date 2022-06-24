import type { REST } from '@discordjs/rest';
import type { Client } from '../../../../Client';
import type { FastifyReply } from 'fastify';

import {
  APIApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  APIEmbed,
  APIMessage,
  InteractionResponseType,
  InteractionType,
  MessageFlags,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  Routes,
} from 'discord-api-types/v10';

import { Member, User } from '../..';
import { CommandInteractionData } from './InteractionData';
import { InteractionTimeoutError } from '../../../../lib/framework';
import { ComponentCallback, ResolvedComponent } from '../../../../server/InteractionHandler';

export class CommandInteraction {
  private restClient: REST;

  private token: string;
  private applicationId: string;
  private id: string;
  private type: InteractionType;

  responded = false;

  guildId?: string;
  channelId?: string;
  data?: CommandInteractionData;
  user?: User;
  member?: Member;
  message?: APIMessage;

  constructor(private client: Client, interaction: APIApplicationCommandInteraction, private reply: FastifyReply) {
    this.restClient = client.restClient;

    this.token = interaction.token;
    this.applicationId = interaction.application_id;
    this.id = interaction.id;

    this.type = interaction.type;

    if (interaction.guild_id) this.guildId = interaction.guild_id;
    if (interaction.channel_id) this.channelId = interaction.channel_id;
    if (interaction.data) this.data = new CommandInteractionData(interaction.data as APIChatInputApplicationCommandInteractionData);
    if (interaction.user) this.user = new User(interaction.user);
    if (interaction.member) this.member = new Member(interaction.member);
    if (interaction.message) this.message = interaction.message;
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

  async awaitComponent(uniqueId: string, timeout = 60_000, memberId?: string) {
    return new Promise<ResolvedComponent>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.client.routeHandler.interactionHandler.pendingComponents.delete(uniqueId);

        reject(new InteractionTimeoutError('Prompt timed out!'));
      }, timeout);

      this.client.routeHandler.interactionHandler.pendingComponents.set(uniqueId, {
        resolve,
        timer,
        memberId,
      });
    });
  }

  async collectComponents(uniqueId: string, options: { timeout?: number, memberId?: string } = {}, callback: ComponentCallback) {
    if (!options.timeout) options.timeout = 60_000;

    return new Promise<ResolvedComponent>((resolve, reject) => {
      const timer = setTimeout(() => {
        this.client.routeHandler.interactionHandler.pendingComponents.delete(uniqueId);

        reject(new InteractionTimeoutError('Prompt timed out!'));
      }, options.timeout);

      this.client.routeHandler.interactionHandler.pendingComponents.set(uniqueId, {
        resolve,
        timer,
        memberId: options.memberId,
        collector: {
          callback,
          reject,
          timeout: options.timeout,
          ended: false,
        },
      });
    });
  }
}
