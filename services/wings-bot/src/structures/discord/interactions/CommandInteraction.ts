import type { REST } from "@discordjs/rest";
import type { Client } from "../../..";
import type { FastifyReply } from "fastify";

import {
  APIApplicationCommandBasicOption,
  APIApplicationCommandInteractionData,
  APIApplicationCommandInteractionDataOption,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved,
  APIInteraction,
  ApplicationCommandOptionType,
  InteractionResponseType,
  InteractionType,
  RESTPostAPIInteractionCallbackFormDataBody,
  RESTPostAPIInteractionFollowupJSONBody,
  RESTPostAPIInteractionFollowupResult,
  Routes
} from "discord-api-types/v10";

import { Member } from "../Member";
import { User } from "../User";
import { APIApplicationCommandOptionBase, APIInteractionDataOptionBase } from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base";

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

  constructor(client: Client, interaction: APIInteraction, private reply: FastifyReply) {
    this.restClient = client.restClient;

    this.token = interaction.token;
    this.applicationId = interaction.application_id;
    this.id = interaction.id;

    this.type = interaction.type;

    if (interaction.channel_id) this.channelId = interaction.channel_id;
    if (interaction.data) this.data = interaction.data;
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

export class CommandInteractionOptions<T extends APIApplicationCommandInteractionDataOption> {
  private options: T[]; 

  constructor(data: APIChatInputApplicationCommandInteractionData) {
    this.options = data.options;
  }

  public get<Type extends DataOptionType<T>['name']>(name: Type): { name: Type } {
    return this.options.find(o => o.name === name);
  }
}

type DataOptionType<T extends APIApplicationCommandOption> =
  T['type'] extends ApplicationCommandOptionType.Subcommand ? APIApplicationCommandSubcommandOption :
  T['type'] extends ApplicationCommandOptionType.SubcommandGroup ? APIApplicationCommandSubcommandGroupOption :
  APIApplicationCommandBasicOption; 
