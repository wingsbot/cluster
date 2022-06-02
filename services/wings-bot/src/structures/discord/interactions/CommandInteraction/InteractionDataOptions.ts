import { APIApplicationCommandInteractionDataOption, APIChatInputApplicationCommandInteractionData } from "discord-api-types/v10";
import { CommandOptions } from "../../../bot";

type ExtractOptions<T> = T extends CommandOptions<infer _Name, infer _Type, infer Options> ? Options[number] : never;

export class CommandInteractionDataOptions<T extends CommandOptions> {
  private options: APIApplicationCommandInteractionDataOption[]; 

  constructor(data: APIChatInputApplicationCommandInteractionData) {
    this.options = data.options;
  }

  public get<O extends ExtractOptions<T>['name']>(name: O): { name: O } {
    return this.options.find(o => o.name === name);
  }
}

