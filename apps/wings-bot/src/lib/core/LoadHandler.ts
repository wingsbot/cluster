import { readdir, Dirent } from 'node:fs';
import { join, resolve, parse } from 'node:path';

import type { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import type { Client } from '../../Client';
import type { Command, Components } from '../../structures';

export class LoadHandler {
  private restClient: REST;
  private commandsDir = join(__dirname ,'../../commands');
  commands: Map<string, Command> = new Map();
  components: Map<string, Components> = new Map();

  constructor(public client: Client) {
    this.restClient = client.restClient;

    this.setCaches();
  }

  async loadCommands() {
    const globalCommands = [];
    const ownerCommands = [];

    for (const command of this.commands.values()) {
      if (command.ownerOnly) {
        ownerCommands.push(command.APIParsedCommand);
        continue;
      }

      globalCommands.push(command.APIParsedCommand);
    }

    this.client.commands = this.commands;

    await Promise.all([
      this.postGuildCommands(ownerCommands),
      this.postGlobalCommands(globalCommands),
    ]);
  }

  async setCaches() {
    const files = await this.getCommandFiles();

    for (const file of files) {
      if (!file.endsWith('.js')) continue;

      const filepath = resolve(this.commandsDir, file);
      const name = parse(filepath).name;
      const commandFile = await import(filepath);

      const newComponents: typeof Components[] = [];
      const newCommands: typeof Command[] = [];

      if (commandFile.__esModule) {
        for (const fileExport of Object.keys(commandFile)) {
          if (fileExport.endsWith('Command')) newCommands.push(commandFile[fileExport]);
          if (fileExport.endsWith('Component')) newComponents.push(commandFile[fileExport]);

          continue;
        }
      }

      if (newCommands.length > 0) {
        for (const FileCommand of newCommands) {
          this.commands.set(name, new FileCommand(this.client, name));
        }
      } else if (newComponents.length > 0) {
        for (const FileCommand of newComponents) {
          this.components.set(name, new FileCommand(this.client, name));
        }
      } else continue;
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
      { body: globalCommands },
    );
  }

  private async postGuildCommands(guildCommands: Command['APIParsedCommand'][]) {
    await this.restClient.put(
      Routes.applicationGuildCommands(this.client.config.applicationId, this.client.config.devServerId),
      { body: guildCommands },
    );
  }
}
