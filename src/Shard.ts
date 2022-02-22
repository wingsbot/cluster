import { Client } from 'eris';
import { Db, MongoClient } from 'mongodb';
import RedisClient, { Redis } from 'ioredis';
import master from 'node:cluster';
import { join } from 'node:path';

import { IPC } from './lib/core/IPC';

import type { Config, StartMessage } from './lib/interfaces/Client.d';

import { config, Store } from './lib/core';
import { Patreon } from './lib/core/Patreon';
import { ClientUtil } from './lib/core/utils/Util';

import { CommandBase, EventBase, InteractionHandler } from './lib/framework';
import { ModuleHandler, Modules } from './lib/framework/ModuleHandler';
import type { GameData } from './lib/interfaces/Games.d';
import { GRPC } from './lib/core/GRPC';

export class Shard extends Client {
  public clusterId: number;
  public totalShards: number;
  public firstShardId: number;

  public config: Config;
  public util: ClientUtil;
  public botInstance: string;
  public db: Db;
  public redis: Redis;

  public interactionHandler: InteractionHandler;
  public moduleHandler: ModuleHandler;

  public commands: Map<string, CommandBase>;
  public events: Map<string, EventBase>;
  public ipc: IPC;
  public grpc: GRPC;
  public patreon: Patreon;

  public activeGames: Map<string, GameData>;
  public decks: Map<string, string[]>;

  public modules: Modules;

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

  public async fetchUser(userId: string) {
    if (this.users.has(userId)) return this.users.get(userId);
    // testin webhook
    return this.getRESTUser(userId);
  }

  private async loadFramework() {
    this.ipc = new IPC(this);
    this.grpc = new GRPC();

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
    const mongo = await MongoClient.connect(this.config.mongodb);
    this.db = mongo.db();
    console.log('Loaded MongoDB');

    this.redis = new RedisClient();
    console.log('Loaded Redis');
  }

  public async start() {
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
