import {
  APIApplicationCommandBooleanOption,
  APIApplicationCommandIntegerOption,
  APIApplicationCommandNumberOption,
  APIApplicationCommandStringOption,
  ApplicationCommandOptionType
} from "discord-api-types/v10";
import { CommandOptions } from "./CommandOptions";

export const string = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandStringOption, 'name' | 'type' | 'description'> = {}
) => new CommandOptions(name, description, ApplicationCommandOptionType.String, options);

export const number = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandNumberOption, 'name' | 'type' | 'description'> = {}
) => new CommandOptions(name, description, ApplicationCommandOptionType.Number, options);

export const integer = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandIntegerOption, 'name' | 'type' | 'description'> = {}
) => new CommandOptions(name, description, ApplicationCommandOptionType.Integer, options);

export const boolean = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandBooleanOption, 'name' | 'type' | 'description'> = {}
) => new CommandOptions(name, description, ApplicationCommandOptionType.Boolean, options);

export const user = <T extends string>(
  name: T,
  description: string,
  options: Omit<APIApplicationCommandBooleanOption, 'name' | 'type' | 'description'> = {}
) => new CommandOptions(name, description, ApplicationCommandOptionType.User, options);
