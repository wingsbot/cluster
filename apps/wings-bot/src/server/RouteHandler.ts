import { FastifyInstance } from 'fastify';

import type { Client } from '../Client';
import { InteractionHandler } from './InteractionHandler';

export interface RawBody {
  parsed: unknown;
  raw: Buffer;
}

export class RouteHandler {
  server: FastifyInstance;
  interactionHandler: InteractionHandler;

  constructor(client: Client) {
    this.server = client.server;
    this.interactionHandler = new InteractionHandler(client);

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
              return done(error, undefined);
            }

            done(null, {
              parsed,
              raw: body as Buffer,
            });
          });
        } catch (error) {
          done(error, null);
        }
      },
    );
  }
}
