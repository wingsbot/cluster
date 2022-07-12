import { APIAttachment, APIEmbed, APIMessage, APIMessageInteraction, MessageType } from 'discord-api-types/v10';
import { User } from './User';

export class Message {
  id: string;
  type: MessageType;
  embeds: APIEmbed[];
  editedTimestamp: string;
  content: string;
  channelId: string;
  author: User;
  attachments: APIAttachment[];
  pinned: boolean;
  timestamp: string;
  tts: boolean;
  guildId?: string;
  interaction?: APIMessageInteraction;

  constructor(private message: APIMessage) {
    this.id = this.message.id;
    this.type = this.message.type;
    this.embeds = this.message.embeds;
    this.editedTimestamp = this.message.edited_timestamp;
    this.content = this.message.content;
    this.channelId = this.message.channel_id;
    this.author = new User(this.message.author);
    this.attachments = this.message.attachments;
    this.pinned = this.message.pinned;
    this.timestamp = this.message.timestamp;
    this.tts = this.message.tts;

    if (this.message.guild_id) this.guildId = this.message.guild_id;
    if (this.message.interaction) this.interaction = this.message.interaction;
  }

  get messageLink() {
    return `https://discord.com/channels/${this.guildId ?? '@me'}/${this.channelId}/${this.id}`;
  }
}
