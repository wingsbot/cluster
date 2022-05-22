import type { APIInteraction } from "discord-api-types/v10";
import { request } from 'undici';

import { Member } from "../Member";
import { User } from "../User";

export class CommandInteraction {
  private interaction: APIInteraction;
  private applicationId: string;
  public channelId?: string;
  public data?: APIInteraction["data"];
  private id: string;

  public user?: User;
  public member?: Member;

  constructor(restClient, APIInteraction: APIInteraction) {
    this.interaction = APIInteraction;
    this.restClient = restClient;
    this.applicationId = this.interaction.application_id;
    this.id = this.interaction.id;

    this.init();
  }

  private init() {
    if (this.interaction.channel_id) this.channelId = this.interaction.channel_id;
    if (this.interaction.data) this.data = this.interaction.data;
    if (this.interaction.user) this.user = new User(this.interaction.user);
    if (this.interaction.member) this.member = new Member(this.interaction.member);
  }

  public async respond(content: string) {
    request
    });
  }
}