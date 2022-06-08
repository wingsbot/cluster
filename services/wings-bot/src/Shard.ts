import master from 'node:cluster';
import { join } from 'node:path';

import { Client } from 'eris';
import RedisClient, { Redis } from 'ioredis';
import { Database } from './lib/database';

import { IPC } from './lib/core/IPC';

import type { Config, StartMessage } from './lib/interfaces/Client';

import { config, Store } from './lib/core';
import { Patreon } from './lib/core/Patreon';
import { ClientUtil } from './lib/core/utils/Util';

import { CommandBase, EventBase, InteractionHandler } from './lib/framework';
import { ModuleHandler, Modules } from './lib/framework/ModuleHandler';
import type { GameData } from './lib/interfaces/Games';

export class Shard extends Client {
  clusterId: number;
  totalShards: number;
  firstShardId: number;

  config: Config;
  util: ClientUtil;
  botInstance: string;
  db: Database;
  redis: Redis;

  interactionHandler: InteractionHandler;
  moduleHandler: ModuleHandler;

  commands: Map<string, CommandBase>;
  events: Map<string, EventBase>;
  ipc: IPC;
  patreon: Patreon;

  activeGames: Map<string, GameData>;
  decks: Map<string, string[]>;

  modules: Modules;

  constructor({ shards, clusterId, totalShards }: StartMessage) {
    super(config.token, {
      firstShardID: shards[0],
      lastShardID: shards[1],
      maxShards: totalShards,
      messageLimit: 0,
      compress: true,
      defaultImageFormat: 'png',
      defaultImageSize: 1024,
      disableEvents: {
        TYPING_START: true,
      },
      allowedMentions: {
        everyone: false,
        roles: false,
        users: true,
      },
      intents: [
        'guilds',
        'guildMembers',
        'guildMessages',
        'guildMessageReactions',
        'directMessages',
        'directMessageReactions',
      ],
    });

    this.firstShardId = shards[0];
    this.clusterId = clusterId;
    this.totalShards = totalShards;

    this.config = config;
    this.botInstance = process.env.botInstance;

    this.util = new ClientUtil(this);
    this.activeGames = new Map();
    this.decks = new Map();
  }

  async fetchUser(userId: string) {
    if (this.users.has(userId)) return this.users.get(userId);

    return this.getRESTUser(userId);
  }

  private async loadFramework() {
    this.ipc = new IPC(this);

    this.events = new Store(this, join(__dirname, './lib/core/events'));
    console.log('Loaded Events');

    this.moduleHandler = new ModuleHandler(this);
    console.log('Loaded Modules');

    this.interactionHandler = new InteractionHandler(this);
    console.log('Loaded Commands');

    this.patreon = new Patreon(this);
    console.log('Started fetching Patrons');
  }

  private async connectDatabases() {
    this.db = new Database();
    console.log('Loaded Database');

    this.redis = new RedisClient();
    console.log('Loaded Redis');
  }

  async start() {
    await this.connect();
    await this.connectDatabases();
    await this.loadFramework();
  }
}

let client: Shard;
master.worker.on('message', async message => {
  switch (message.op) {
    case 'start': {
      client = new Shard(message as StartMessage);
      client.start();
      break;
    }

    default: {
      client.emit('ipc', message);

      break;
    }
  }
});

process.on('unhandledRejection', (error: any) => {
  if (error.message?.startsWith('Request timed out')) return;

  try {
    if ([0, 10003, 10008, 40005, 50001, 50013].indexOf(error.response.code)) return;

    console.error(error);
  } catch {
    console.error(`Unhandled promise rejection, ${error.stack}`);
  }
});

process.on('uncaughtException', (error: any) => {
  console.error(`Uncaught exception, ${error.stack}`);
});
