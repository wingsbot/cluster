import { FastifyInstance } from "fastify";

import { Client } from "..";
import { InteractionHandler } from "./InteractionHandler";

export interface RawBody {
  parsed: unknown;
  raw: Buffer;
}

export class RouteHandler {
  public client: Client;
  public server: FastifyInstance;
  public interactionHandler: InteractionHandler;

  constructor(client: Client) {
    this.client = client;
    this.server = this.client.server;
    this.interactionHandler = new InteractionHandler(this);

    this.rawBody(this.server);
  }

  private rawBody(app: FastifyInstance): void {
    const defaultParser = app.getDefaultJsonParser('ignore', 'ignore');
  
    app.addContentTypeParser(
      'application/json',
      { parseAs: 'buffer' },
      (request, body, done: (error: Error, result: RawBody) => void) => {
        try {
          defaultParser(request, body as string, (error, parsed) => {
            if (error) {
              return done(error, null);
            }
  
            done(null, {
              parsed,
              raw: body as Buffer,
            });
          });
        } catch (error) {
          done(error as Error, null);
        }
      },
    );
  }
}