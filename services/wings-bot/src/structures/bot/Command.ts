import type {
  RESTPatchAPIApplicationCommandJSONBody,
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandInteractionDataOption,
  ApplicationCommandOptionType
} from "discord-api-types/v10";

import type { Client } from "../..";
import type { CommandInteraction } from "..";
import type { CommandInteractionOptions} from "../discord/interactions/CommandInteraction";

export interface CommandData<T extends Command> {
  interaction: CommandInteraction;
  options: CommandInteractionOptions<T['options']>;
}

export class Command {
  public description = 'No description implimented.';
  public options?: CommandOptions;
  public allowDM = true;
  public ownerOnly = false;
  public patronOnly = false;

  constructor(public client: Client, public name: string) {}

  public get APIParsedCommand(): RESTPatchAPIApplicationCommandJSONBody {
    return {
      name: this.name,
      description: this.description,
      ...this.options && { options: this.options.options },
      dm_permission: this.allowDM
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(context: CommandData<null>) {
    throw new Error(`Command ${this.name} has not been implemented.`);
  }
}

export class CommandOptions<
 Name extends string = string,
 Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
 Options extends CommandOptions[] = [],
 Choices extends Choice<Type> = Choice<Type>,
> {
  private subOptions: CommandOptions[] = [];

  constructor(public name: Name, private type: Type, private options: Omit<Extract<APIApplicationCommandOption, { type: Type }>, 'name' | 'type' | 'autocomplete'>) {
    if (typeof options.description === 'function') options.description = 'test';
  }

  public addOption<T extends CommandOptions>(option: T): CommandOptions<Name, Type, [...Options, T]> {
    this.subOptions.push(option)

    return this;
  }

  public addSubCommand(subCommand: APIApplicationCommandSubcommandOption) {
    this.options.push(subCommand);

    return this;
  }

  public addSubCommandGroup(subCommandGroup: APIApplicationCommandSubcommandGroupOption) {
    this.options.push(subCommandGroup);

    return this;
  }
}

type Choice<T extends ApplicationCommandOptionType> =
  T extends ApplicationCommandOptionType.String ? string :
  T extends (ApplicationCommandOptionType.Number | ApplicationCommandOptionType.Integer) ? number :
  never;
