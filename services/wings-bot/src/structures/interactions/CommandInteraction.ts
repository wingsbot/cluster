import type { RequestData, REST } from "@discordjs/rest";
import { APIInteraction, InteractionResponseType, InteractionType, RESTPostAPIApplicationCommandsJSONBody, RESTPostAPIChannelMessageResult, RESTPostAPIInteractionCallbackFormDataBody, RESTPostAPIInteractionCallbackJSONBody, RESTPostAPIInteractionFollowupJSONBody, RESTPostAPIInteractionFollowupResult, RESTPostAPIWebhookWithTokenWaitResult, Routes } from "discord-api-types/v10";

import { Member } from "../Member";
import { User } from "../User";

export class CommandInteraction {
  private interaction: APIInteraction;
  private client: REST;

  private token: string;
  private applicationId: string;
  private id: string;
  private type: InteractionType;

  private responded: boolean = false;

  public channelId?: string;
  public data?: APIInteraction["data"];
  public user?: User;
  public member?: Member;

  constructor(restClient: REST, APIInteraction: APIInteraction) {
    this.interaction = APIInteraction;
    this.client = restClient;

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

  public async send(content: string, options: RESTPostAPIInteractionFollowupJSONBody = {}) {
    const interactionContent = Object.assign({ content }, options);

    if (!this.responded) {
      this.responded = true;

      return this.client.post(
        Routes.interactionCallback(this.id, this.token),
        { 
          body: {
          type: InteractionResponseType.ChannelMessageWithSource,
          data: interactionContent
          },
        auth: false
      }) as Promise<RESTPostAPIInteractionFollowupResult>;
    }

    return this.client.post(
      Routes.webhook(this.applicationId, this.token),
      {
        body: interactionContent,
        auth: false
      }
    ).catch(error => {
      console.error(error);
      return null;
    }) as Promise<RESTPostAPIInteractionFollowupResult>;
  }
}