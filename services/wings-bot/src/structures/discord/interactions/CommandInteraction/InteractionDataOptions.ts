import { APIApplicationCommandInteractionDataOption, APIChatInputApplicationCommandInteractionData } from "discord-api-types/v10";

export class CommandInteractionDataOptions<T extends APIApplicationCommandInteractionDataOption> {
  private options: T[]; 

  constructor(data: APIChatInputApplicationCommandInteractionData) {
    this.options = data.options;
  }

  public get<Type extends T['name']>(name: Type): { name: Type } {
    return this.options.find(o => o.name === name);
  }
}

