import type { REST } from "@discordjs/rest";
import type { Client } from "../..";
import type { FastifyReply } from "fastify";

import {
  APIInteraction,
  InteractionResponseType,
  InteractionType,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  Routes
} from "discord-api-types/v10";

import { Member } from "../Member";
import { User } from "../User";

export class CommandInteraction {
  private interaction: APIInteraction;
  private client: REST;
  private reply : FastifyReply;

  private token: string;
  private applicationId: string;
  private id: string;
  private type: InteractionType;

  private responded = false;

  public channelId?: string;
  public data?: APIInteraction["data"];
  public user?: User;
  public member?: Member;

  constructor(client: Client, APIInteraction: APIInteraction, reply: FastifyReply) {
    this.interaction = APIInteraction;
    this.client = client.restClient;
    this.reply = reply;

    this.token = APIInteraction.token;
    this.applicationId = this.interaction.application_id;
    this.id = this.interaction.id;

    this.type = APIInteraction.type;

    this.init();
  }

  private init() {
    if (this.interaction.channel_id) this.channelId = this.interaction.channel_id;
    if (this.interaction.data) this.data = this.interaction.data;
    if (this.interaction.user) this.user = new User(this.interaction.user);
    if (this.interaction.member) this.member = new Member(this.interaction.member);
  }

  async sendInteraction(type: number, data: RESTPostAPIInteractionCallbackFormDataBody) {
    this.responded = true;

    return this.reply.status(200).send({
      type,
      data
    });
  }

  public async send(content: string, options: RESTPostAPIInteractionFollowupJSONBody = {}) {
    const data = Object.assign({ content }, options);

    if (!this.responded) return this.sendInteraction(InteractionResponseType.ChannelMessageWithSource, data);

    return this.client.post(
      Routes.webhook(this.applicationId, this.token),
      {
        body: data,
        auth: false
      }
    ).catch(error => {
      console.error(error);
      return null;
    }) as Promise<RESTPostAPIInteractionFollowupResult>;
  }
}