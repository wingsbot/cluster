import {
  APIApplicationCommandOption,
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';

type Choice<T extends ApplicationCommandOptionType> = T extends ApplicationCommandOptionType.String ?
  string : T extends (ApplicationCommandOptionType.Number | ApplicationCommandOptionType.Integer) ?
  number : never;

// todo: add choices through here
export class CommandOptions<
 Name extends string = string,
 Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
 Options extends CommandOptions[] = [],
 Choices extends Choice<Type> = Choice<Type>,
> {
  private subOptions: APIApplicationCommandOption[] = [];

  constructor(
    public name?: Name,
    public description?: string,
    public type?: Type,
    // note: make proper types passing correct type through
    public options?: Omit<Extract<APIApplicationCommandOption, { type: Type }>, 'name' | 'type' | 'description'>,
  ) {}

  // todo: proper build for subcmds and sub groups
  private buildOption(): APIApplicationCommandOption {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      ...this.options,
    } as APIApplicationCommandOption;

    /*
     if (parentTypes.has(option.type)) {
      (option as APIApplicationCommandSubcommandOption)
        .options = this.subOptions.map(opt => opt.build() as APIApplicationCommandBasicOption);
    }
    */
  }

  build() {
    return this.subOptions;
  }

  addOption<T extends CommandOptions>(option: T): CommandOptions<Name, Type, [...Options, T], Choices> {
    this.subOptions.push(option.buildOption());

    return this as any;
  }

  public setChoices<O extends Record<string, Choices>>(
    choices: Readonly<O>,
  ): CommandOptions<Name, Type, Options, O[keyof O]> {
    (this.options as unknown as { choices: APIApplicationCommandOptionChoice[] })
      .choices = Object.entries(choices).map(([ name, value ]) => ({ name, value }));

    return this as any;
  }
}
