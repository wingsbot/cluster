import fastify from 'fastify';
import { REST } from '@discordjs/rest';
import RedisClient, { Redis } from 'ioredis';
import { RouteHandler } from './server/routeHandler';
// import { Database } from './lib/database';

import config from './Config';
import { LoadCommands } from './lib/core/LoadCommands';
import { ModuleHandler } from './lib/framework/ModuleHandler';

export class Client {
  public server = fastify({ logger: true });
  public restClient = new REST({ version: config.APIVersion }).setToken(config.botToken);
  public routeHandler: RouteHandler;

  public config = config;
  // public db: Database;
  public redis: Redis;

  // public modules = new ModuleHandler(this);
  public commands = new LoadCommands(this).commands;

  async init() {
    await Promise.all([
      this.loadDatabases(),
      this.startServer()
    ]);
  }

  async startServer() {
    this.routeHandler = new RouteHandler(this);

    this.server.listen(this.config.port, this.config.host, (error, address) => {
      console.log(`Listening on port ${this.config.port}\nLink: ${address}`);
   });
  }

  private async loadDatabases() {
    // this.db = new Database();
    console.log('Loaded Database');

    this.redis = new RedisClient();
    console.log('Loaded Redis');
  }
}

const client = new Client();
client.init();
