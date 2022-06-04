import {
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  ApplicationCommandOptionType
} from "discord-api-types/v10";

export class CommandOptions<
 Name extends string = string,
 Type extends ApplicationCommandOptionType = ApplicationCommandOptionType,
 Options extends CommandOptions[] = [],
> {
  private subOptions: APIApplicationCommandOption[] = [];

  constructor(
    public name?: Name,
    public description?: string,
    public type?: number,
    // note: make proper types passing correct type through
    public options: Omit<APIApplicationCommandOption, 'name' | 'type' | 'description'> = {},
  ) {}

  private buildOption(): APIApplicationCommandBasicOption {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      ...this.options,
    };
  }

  public build() {
    return this.subOptions;
  }

  public addOption<T extends CommandOptions>(option: T): CommandOptions<Name, Type, [...Options, T]> {
    this.subOptions.push(option.buildOption());

    return this;
  }
}
