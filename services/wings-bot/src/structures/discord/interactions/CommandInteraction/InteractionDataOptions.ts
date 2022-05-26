
export class CommandInteractionDataOptions<T extends APIApplicationCommandInteractionDataOption> {
  private options: T[]; 

  constructor(data: APIChatInputApplicationCommandInteractionData) {
    this.options = data.options;
  }

  public get<Type extends DataOptionType<T>['name']>(name: Type): { name: Type } {
    return this.options.find(o => o.name === name);
  }
}

type DataOptionType<T extends APIApplicationCommandOption> =
  T['type'] extends ApplicationCommandOptionType.Subcommand ? APIApplicationCommandSubcommandOption :
  T['type'] extends ApplicationCommandOptionType.SubcommandGroup ? APIApplicationCommandSubcommandGroupOption :
  APIApplicationCommandBasicOption; 
