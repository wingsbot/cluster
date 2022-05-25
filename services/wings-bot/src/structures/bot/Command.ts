import type {
  RESTPatchAPIApplicationCommandJSONBody,
  APIApplicationCommandBasicOption,
  APIApplicationCommandOption,
  APIApplicationCommandSubcommandGroupOption,
  APIApplicationCommandSubcommandOption,
  APIApplicationCommandInteractionDataOption
} from "discord-api-types/v10";

import type { Client } from "../..";
import type { CommandInteraction } from "..";
import type { CommandInteractionData } from "../discord/interactions/CommandInteraction";
import { APIInteractionDataOptionBase } from "discord-api-types/payloads/v10/_interactions/_applicationCommands/_chatInput/base";

export interface CommandData<T extends Command> {
  interaction: CommandInteraction;
  options: CommandInteractionData<T>;
}

export class Command {
  public client: Client;
  public name: string;
  public description = 'No description implimented.';
  public options?: CommandOptions;
  public allowDM = true;
  public ownerOnly = false;
  public patronOnly = false;

  constructor(client: Client, name: string) {
    this.client = client;
    this.name = this.name || name;
  }

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

export class CommandOptions {
  options: APIApplicationCommandOption[];

  constructor() {
    this.options = [];
  }

  public addOption(option: APIApplicationCommandBasicOption) {
    this.options.push(option);

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
