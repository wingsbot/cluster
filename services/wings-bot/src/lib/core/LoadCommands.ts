import type { REST } from "@discordjs/rest";

export class LoadCommands extends Map {
  private restClient: REST;

  constructor(restClient: REST) {
    super();
    this.restClient = restClient;
  }

  public async loadCommands() {
    const commands = await this.restClient.commands.getAll();

    for (const command of commands) {
      this.set(command.name, command);
    }
  }
}