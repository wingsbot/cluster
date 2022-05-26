import { APIApplicationCommandOption } from "discord-api-types/v10";

export class CommandOptions<
 Name extends string = string,
 Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
 Options extends CommandInteractionDataOptions[] = [],
 Choices extends Choice<Type> = Choice<Type>,
> {
  private subOptions: CommandInteractionDataOptions[] = [];

  constructor(public name: Name, private type: Type, private options: Omit<Extract<APIApplicationCommandOption, { type: Type }>, 'name' | 'type' | 'autocomplete'>) {
    if (typeof options.description === 'function') options.description = 'test';
  }

  public build(): APIApplicationCommandOption[] {
    return this.options;
  }

  public addOption<T extends CommandInteractionDataOptions>(option: T): CommandInteractionDataOptions<Name, Type, [...Options, T]> {
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
