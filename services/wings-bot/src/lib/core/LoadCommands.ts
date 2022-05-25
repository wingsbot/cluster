import type { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import type { Client } from "../..";
import { Command } from "../../structures";

export class LoadCommands {
  private client: Client;
  private restClient: REST;
  public commands: Map<string, Command> = new Map();

  constructor(client: Client) {
    this.client = client;
    this.restClient = this.client.restClient;

    this.loadCommands();
  }

  public async loadCommands() {
    const globalCommands = [];
    const ownerCommands = [];

    for (const command of this.commands.values()) {
      if (command.ownerOnly) {
        ownerCommands.push(command.APIParsedCommand);
        continue;
      }
      
      globalCommands.push(command.APIParsedCommand);
    }

    await Promise.all([
      this.postGuildCommands(ownerCommands),
      this.postGlobalCommands(globalCommands)
    ]);
  }

  public setCacheCommands() {
    
  }

  private async postGlobalCommands(globalCommands: Command['APIParsedCommand'][]) {
    await this.restClient.put(
      Routes.applicationCommands(this.client.config.applicationId),
      { body: globalCommands }
    );
  }

  private async postGuildCommands(guildCommands: Command['APIParsedCommand'][]) {
    await this.restClient.put(
      Routes.applicationGuildCommands(this.client.config.applicationId, this.client.config.devServerId),
      { body: guildCommands }
    );
  }
}