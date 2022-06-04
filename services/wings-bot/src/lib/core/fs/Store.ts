import { resolve, parse } from 'node:path';
import { readdir, Dirent } from 'node:fs';

import type { Shard } from '../../../Shard';

export class Store extends Map {
  public client: Shard;
  public directory: string;
  public subDirectories: boolean;

  constructor(client: Shard, directory: string, subDirectories = false) {
    super();
    this.client = client;
    this.directory = directory;
    this.subDirectories = subDirectories;

    this.load();
  }

  private async getFiles(directory = this.directory, subDirectories = this.subDirectories) {
    if (subDirectories) {
      const dirents: Dirent[] = await new Promise((resolve, reject) => {
        readdir(directory, { withFileTypes: true }, (error, files: Dirent[]) => {
          if (error) {
            reject(error);
          } else {
            resolve(files);
          }
        });
      });

      const names: string[] = [];
      for (const folder of dirents.filter(dirent => dirent.isDirectory())) {
        const files = await this.getFiles(`${directory}/${folder.name}`, subDirectories);
        for (const name of files) {
          names.push(`${folder.name}/${name}`);
        }
      }

      for (const file of dirents.filter(dirent => dirent.isFile())) {
        names.push(file.name);
      }

      return names;
    }

    const names: string[] = await new Promise((resolve, reject) => {
      readdir(directory, (error: Error | null, files: string[]) => {
        if (error) {
          reject(error);
        } else {
          resolve(files);
        }
      });
    });
    return names;
  }

  public async load() {
    const files = await this.getFiles();

    for (const file of files) {
      if (!file.endsWith('.js')) {
        continue;
      }

      const filepath = resolve(this.directory, file);
      const name = parse(filepath).name;
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      let RequestItem = require(filepath);

      if (typeof (RequestItem) === 'object' && RequestItem.__esModule) RequestItem = RequestItem.default;
      else throw new Error(`The file ${name} is all fucked up lmao.`);

      if (this.directory.includes('modules')) {
        this.client[name] = new RequestItem(this.client, name, this);
      }

      this.set(name, new RequestItem(this.client, name, this));
    }
  }
}
