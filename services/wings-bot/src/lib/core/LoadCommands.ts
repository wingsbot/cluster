import { readdir, Dirent } from 'node:fs';
import { join, resolve, parse } from 'node:path';

import type { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v10";
import type { Client } from "../..";
import { Command } from "../../structures";

export class LoadCommands {
  private restClient: REST;
  private commandsDir = join(__dirname ,'../../commands');
  public commands: Map<string, Command> = new Map();

  constructor(public client: Client) {
    this.restClient = client.restClient;

    this.setCacheCommands();
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

  public async setCacheCommands() {
   const files = await this.getCommandFiles();
    
   for (const file of files) {
    if (!file.endsWith('.js')) continue;

    const filepath = resolve(this.commandsDir, file);
    const name = parse(filepath).name;
    const commandFile = await import(filepath);

    const newCommands: Command[] = [];

    if (commandFile.__esModule) {
      if (typeof commandFile === 'function' && typeof commandFile.prototype === 'object') {
        newCommands.push(commandFile.default);
      } else {
        for (const fileExport of Object.keys(commandFile)) {
          if (!fileExport.endsWith('Command')) continue;
          newCommands.push(commandFile[fileExport]);
        }
      }
    } else {
      newCommands.push(commandFile);
    }

    if (newCommands.length === 0) continue;

    for (const FileCommand of newCommands) {
      this.commands.set(name, new FileCommand(this.client, name));
    }
   }
  }

  private async getCommandFiles(directory?: string) {
    const files: Dirent[] = await new Promise((resolve, reject) => {
      readdir(directory || this.commandsDir, { withFileTypes: true }, async (error, files: Dirent[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });

    const names: string[] = [];
  
    for (const folder of files.filter(dirent => dirent.isDirectory())) {
      const files = await this.getCommandFiles(`${directory || this.commandsDir}/${folder.name}`);

      for (const name of files) {
        names.push(`${folder.name}/${name}`);
      }
    }

    for (const file of files.filter(dirent => dirent.isFile())) {
      names.push(file.name);
    }

    return names;
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