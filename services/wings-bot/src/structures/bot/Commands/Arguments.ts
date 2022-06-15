import {
  APIApplicationCommandAttachmentOption,
  APIApplicationCommandBooleanOption,
  APIApplicationCommandChannelOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandMentionableOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandRoleOption,
  APIApplicationCommandStringOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandUserOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import { CommandOptions } from './CommandOptions';

export const attachment = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandAttachmentOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Attachment, options);

export const boolean = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandBooleanOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Boolean, options);

export const channel = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandChannelOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Channel, options);

export const integer = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandIntegerOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Integer, options);

export const mentionable = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandMentionableOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Mentionable, options);

export const number = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandNumberOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Number, options);

export const role = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandRoleOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Role, options);

export const string = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandStringOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.String, options);

// note: For sub commands maybe use command option class (reusable)
export const subCommand = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandSubcommandOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.Subcommand, options);

export const subCommandGroup = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandSubcommandGroupOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.SubcommandGroup, options);

export const user = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandUserOption, 'name' | 'type' | 'description'> = {},
) => new CommandOptions(name, description, ApplicationCommandOptionType.User, options);
