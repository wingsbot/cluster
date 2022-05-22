import fastify from 'fastify';
import RedisClient, { Redis } from 'ioredis';
import { RouteHandler } from './server/routeHandler';
// import { Database } from './lib/database';

import config from './Config';

export class Client {
  public server = fastify({ logger: true });;
  public routeHandler: RouteHandler;
  public config = config;
  // public db: Database;
  public redis: Redis;

  async init() {
    await this.loadDatabases(),
    await this.startServer()
  }

  async startServer() {
    this.routeHandler = new RouteHandler(this);

    this.server.listen(this.config.port, this.config.host, (err, address) => {
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

if (require.main === module) {
  const client = new Client();
  client.init();
}