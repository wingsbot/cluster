import {
  APIApplicationCommandOption,
  ApplicationCommandOptionType
} from "discord-api-types/v10";

// todo: add choices through here
export class CommandOptions<
 Name extends string = string,
 Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
 Options extends CommandOptions[] = [],
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
  }

  public build() {
    return this.subOptions;
  }

  public addOption<T extends CommandOptions>(option: T): CommandOptions<Name, Type, [...Options, T]> {
    this.subOptions.push(option.buildOption());

    return this;
  }
}
