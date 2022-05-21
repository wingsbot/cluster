import fastify from 'fastify';
import config from './lib/core/utils/Config';
import RedisClient, { Redis } from 'ioredis';
import { Database } from './lib/database';

export class Client {
  public server = fastify({ logger: true });;
  public config = config;
  public db: Database;
  public redis: Redis;

  async init() {
    await Promise.all([
      this.loadDatabases(),
      this.listen()
    ]);
  }

  listen() {
    this.server.listen(this.config.port, this.config.host, (err, address) => {
      console.log(`Listening on port ${this.config.port}\nLink: ${address}`);
   });
  }

  private async loadDatabases() {
    this.db = new Database();
    console.log('Loaded Database');

    this.redis = new RedisClient();
    console.log('Loaded Redis');
  }
}

if (require.main === module) {
  const client = new Client();
  client.init();
}