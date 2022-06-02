import { APIApplicationCommandOptionBase } from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base";
import { APIApplicationCommandAttachmentOption, APIApplicationCommandBasicOption, APIApplicationCommandOption, ApplicationCommandOptionType } from "discord-api-types/v10";
import { CommandInteractionDataOptions } from "../discord";

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
    public options: Omit<APIApplicationCommandOption, 'name' | 'type' | 'description'> = {},
  ) {}

  public build(): APIApplicationCommandBasicOption {
    return {
      name: this.name,
      description: this.description,
      type: this.type,
      ...this.options,
    };
  }

  public addOption<T extends CommandOptions>(option: T): CommandOptions<Name, Type, [...Options, T]> {
    this.subOptions.push(option.build());

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
