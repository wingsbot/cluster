import {
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandOptionChoice,
  APIApplicationCommandSubcommandOption,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

type Choice<T extends ApplicationCommandOptionType> = T extends ApplicationCommandOptionType.String ?
  string : T extends (ApplicationCommandOptionType.Number | ApplicationCommandOptionType.Integer) ?
  number : never;

export class CommandOptions<
 Name extends string = string,
 Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
 Options extends CommandOptions[] = [],
 Choices extends Choice<Type> = Choice<Type>,
> {
  private subOptions: CommandOptions[] = [];

  constructor(
    public name?: Name,
    public description?: string,
    public type?: Type,
    public options?: Omit<Extract<APIApplicationCommandOption, { type: Type }>, 'name' | 'type' | 'description'>,
  ) {}

  // todo: proper build for subcmds and sub groups
  private buildOption(): APIApplicationCommandOption {
    const option = {
      name: this.name,
      description: this.description,
      type: this.type,
      ...this.options,
    } as APIApplicationCommandOption;

    if (option.type === ApplicationCommandOptionType.Subcommand || option.type === ApplicationCommandOptionType.SubcommandGroup) {
      (option as APIApplicationCommandSubcommandOption).options = this.subOptions.map(opt => opt.buildOption() as APIApplicationCommandBasicOption);
    }

    return option;
  }

  build() {
    return this.subOptions.map(opt => opt.buildOption());
  }

  addOption<T extends CommandOptions>(option: T): CommandOptions<Name, Type, [...Options, T], Choices> {
    this.subOptions.push(option);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any;
  }

  public setChoices<O extends Record<string, Choices>>(
    choices: Readonly<O>,
  ): CommandOptions<Name, Type, Options, O[keyof O]> {
    (this.options as unknown as { choices: APIApplicationCommandOptionChoice[] })
      .choices = Object.entries(choices).map(([ name, value ]) => ({ name, value }));

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this as any;
  }
}
