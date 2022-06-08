import type { FastifyReply, FastifyRequest } from 'fastify';
import { sign } from 'tweetnacl';
import { APIInteraction, InteractionType } from 'discord-api-types/v10';

import type { RawBody } from './RouteHandler';
import type { Client } from '..';

import { sendAutocomplete, sendCommand, sendComponent, sendModalSubmit, sendPing } from './handlers';
import { CommandInteraction } from '../structures';

export interface InteractionData<T> {
  client: Client;
  interaction: T;
  reply: FastifyReply;
}

export class InteractionHandler {
  private publicKey: Buffer;

  constructor(private client: Client) {
    this.publicKey = Buffer.from(client.config.publicKey, 'hex');

    this.client.server.post('/interactions', {}, this.handleInteraction.bind(this));
  }

  async handleInteraction (request: FastifyRequest & { body: RawBody }, reply: FastifyReply) {
    const { isVerified, body } = this.verifyRequest(request);

    if (!isVerified) return reply.status(401).send({ error: 'invalid request signature' });

    switch (body.type) {
    case InteractionType.Ping: {
      const context = {
        client: this.client,
        interaction: body,
        reply,
      };

      await sendPing(context);
      break;
    }
      
    case InteractionType.ApplicationCommand: {
      const context = {
        client: this.client,
        interaction: new CommandInteraction(this.client, body, reply),
        reply,
      };

      await sendCommand(context);
      break;
    }

    case InteractionType.MessageComponent: {
      const context = {
        client: this.client,
        interaction: body,
        reply,
      };

      await sendComponent(context);
      break;
    }

    case InteractionType.ApplicationCommandAutocomplete: {
      const context = {
        client: this.client,
        interaction: body,
        reply,
      };

      await sendAutocomplete(context);
      break;
    }

    case InteractionType.ModalSubmit: {
      const context = {
        client: this.client,
        interaction: body,
        reply,
      };

      await sendModalSubmit(context);
      break;
    }

    default: {
      console.warn('Unknown interaction type');
    }
    }
  }

  verifyRequest(request: FastifyRequest & { body: RawBody }) {
    const signature = request.headers['x-signature-ed25519'] as string;
    const timestamp = request.headers['x-signature-timestamp'] as string;
    const body = request.body;

    const isVerified = sign.detached.verify(
      Buffer.from(timestamp + body.raw.toString()),
      Buffer.from(signature, 'hex'),
      this.publicKey,
    );

    return { isVerified, body: body.parsed as APIInteraction };
  }
}
