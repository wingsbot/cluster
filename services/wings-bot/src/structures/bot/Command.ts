import type {
  RESTPatchAPIApplicationCommandJSONBody,
} from "discord-api-types/v10";

import type { Client } from "../..";
import type { CommandInteraction } from "..";
import { CommandInteractionDataOptions } from "../discord";
import { CommandOptions } from "./CommandOptions";

export interface CommandData<T extends Command> {
  interaction: CommandInteraction;
  options?: CommandInteractionDataOptions<T['options']>;
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
      ...this.options && { options: this.options.build() },
      dm_permission: this.allowDM
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async run(context: CommandData<Command>) {
    throw new Error(`Command ${this.name} does not have a run function >:(`);
  }
}
