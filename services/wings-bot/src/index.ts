import fastify from 'fastify';
import { REST } from '@discordjs/rest';
import RedisClient from 'ioredis';
import { RouteHandler } from './server/routeHandler';
// import { Database } from './lib/database';

import config from './Config';
import { LoadCommands } from './lib/core/LoadCommands';
import { ModuleHandler } from './lib/framework/ModuleHandler';
import { Database } from './database';
import { ClientUtil } from './lib/core/utils/Util';

export class Client {
  server = fastify({ logger: true });
  restClient = new REST({ version: config.APIVersion }).setToken(config.botToken);
  routeHandler: RouteHandler;

  config = config;
  db = new Database();
  redis = new RedisClient();

  modules = new ModuleHandler(this);
  commands = new LoadCommands(this).commands;

  utils = new ClientUtil();

  async init() {
    await Promise.all([
      this.startServer(),
    ]);
  }

  async startServer() {
    this.routeHandler = new RouteHandler(this);

    this.server.listen(this.config.port, this.config.host, (error, address) => {
      console.log(`Listening on port ${this.config.port}\nLink: ${address}`);
    });
  }

}

const client = new Client();
client.init();
