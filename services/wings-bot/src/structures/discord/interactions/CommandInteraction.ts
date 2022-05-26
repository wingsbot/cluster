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
  private interaction: APIInteraction;
  private client: REST;
  private reply : FastifyReply;

  private token: string;
  private applicationId: string;
  private id: string;
  private type: InteractionType;

  private responded = false;

  public channelId?: string;
  public data?: CommandInteractionData;
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

    if (this.interaction.channel_id) this.channelId = this.interaction.channel_id;
    if (this.interaction.data) this.data = new CommandInteractionData(this.interaction.data as APIChatInputApplicationCommandInteractionData);
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
