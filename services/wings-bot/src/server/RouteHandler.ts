import { FastifyInstance } from "fastify";
import { Client } from "..";
import { InteractionHandler } from "./InteractionHandler";

export class RouteHandler {
  public client: Client;
  public server: FastifyInstance;
  public publicKey: Buffer;

  constructor(client: Client) {
    this.client = client;
    this.server = this.client.server;
    this.publicKey = Buffer.from(this.client.config.publicKey, 'hex');

    this.server.post('/api/interactions', {}, new InteractionHandler(this).handleInteraction,);
  }
}