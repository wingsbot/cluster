import type { REST } from "@discordjs/rest";
import type { Client } from "../../../..";
import type { FastifyReply } from "fastify";

import {
  APIApplicationCommandInteraction,
  APIChatInputApplicationCommandInteractionData,
  InteractionResponseType,
  InteractionType,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  Routes
} from "discord-api-types/v10";

import { Member } from "../../Member";
import { User } from "../../User";
import { CommandInteractionData } from "./InteractionData";

export class CommandInteraction {
  private restClient: REST;

  private token: string;
  private applicationId: string;
  private id: string;
  private type: InteractionType;

  private responded = false;

  public channelId?: string;
  public data?: CommandInteractionData;
  public user?: User;
  public member?: Member;

  constructor(client: Client, interaction: APIApplicationCommandInteraction, private reply: FastifyReply) {
    this.restClient = client.restClient;

    this.token = interaction.token;
    this.applicationId = interaction.application_id;
    this.id = interaction.id;

    this.type = interaction.type;

    if (interaction.channel_id) this.channelId = interaction.channel_id;
    if (interaction.data) this.data = new CommandInteractionData(interaction.data as APIChatInputApplicationCommandInteractionData);
    if (interaction.user) this.user = new User(interaction.user);
    if (interaction.member) this.member = new Member(interaction.member);
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

    return this.restClient.post(
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
