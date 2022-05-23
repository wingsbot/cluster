import type { FastifyReply, FastifyRequest } from 'fastify';
import { sign } from 'tweetnacl';
import { APIInteraction, InteractionType } from 'discord-api-types/v10';

import type { RawBody, RouteHandler } from './routeHandler';
import type { Client } from '..';

import { sendAutocomplete, sendCommand, sendComponent, sendModalSubmit, sendPing } from './handlers';
import { CommandInteraction } from '../structures';

export interface InteractionData<T> {
  client: Client;
  interaction: T;
  reply: FastifyReply;
}

export class InteractionHandler {
  private routeHandler: RouteHandler;
  private publicKey: Buffer;

  constructor(routeHandler: RouteHandler) {
    this.routeHandler = routeHandler;
    this.publicKey = Buffer.from(this.routeHandler.client.config.publicKey, 'hex');

    this.routeHandler.server.post('/interactions', {}, this.handleInteraction.bind(this));
  }

 public async handleInteraction (request: FastifyRequest & { body: RawBody }, reply: FastifyReply) {
    const { isVerified, body } = this.verifyRequest(request);

    if (!isVerified) return reply.status(401).send({ error: 'invalid request signature' });

    switch (body.type) {
      case InteractionType.Ping: {
        const ctx = {
          client: this.routeHandler.client,
          interaction: body,
          reply,
        };

        await sendPing(ctx);
        break;
      }
      
      case InteractionType.ApplicationCommand: {
        const ctx = {
          client: this.routeHandler.client,
          interaction: new CommandInteraction(this.routeHandler.client.restClient, body),
          reply,
        };

        await sendCommand(ctx);
        break;
      }

      case InteractionType.MessageComponent: {
        const ctx = {
          client: this.routeHandler.client,
          interaction: body,
          reply,
        };

        await sendComponent(ctx);
        break;
      }

      case InteractionType.ApplicationCommandAutocomplete: {
        const ctx = {
          client: this.routeHandler.client,
          interaction: body,
          reply,
        };

        await sendAutocomplete(ctx);
        break;
      }

      case InteractionType.ModalSubmit: {
        const ctx = {
          client: this.routeHandler.client,
          interaction: body,
          reply,
        };

        await sendModalSubmit(ctx);
        break;
      }

      default: {
        console.warn(`Unknown interaction type`);
      }
    }

    reply.status(200).send({ success: true });
  }

  public verifyRequest(request: FastifyRequest & { body: RawBody }) {
    const signature = request.headers['x-signature-ed25519'] as string;
    const timestamp = request.headers['x-signature-timestamp'] as string;
    const body = request.body;

    const isVerified = sign.detached.verify(
      Buffer.from(timestamp + body.raw.toString()),
      Buffer.from(signature, 'hex'),
      this.publicKey
    );

    return { isVerified, body: body.parsed as APIInteraction }
  }
}
