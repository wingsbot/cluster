import type {
  APIChatInputApplicationCommandInteractionData,
  APIChatInputApplicationCommandInteractionDataResolved,
} from 'discord-api-types/v10';
import { CommandInteractionDataOptions } from './';

export class CommandInteractionData {
  id: string;
  name: string;
  type: number;
  guildId?: string;
  options?: CommandInteractionDataOptions;
  resolved?: APIChatInputApplicationCommandInteractionDataResolved;

  constructor(private data: APIChatInputApplicationCommandInteractionData) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;

    if (data.guild_id) this.guildId = data.guild_id;
    if (data.options) this.options = new CommandInteractionDataOptions(data.options, data.resolved);
    if (data.resolved) this.resolved = data.resolved;
  }
}
