import type { FastifyReply, FastifyRequest } from 'fastify';
import { sign } from 'tweetnacl';
import { APIInteraction, InteractionType } from 'discord-api-types/v10';

import type { RawBody } from './RouteHandler';
import type { Client } from '../Client';

import { sendAutocomplete, sendCommand, sendComponent, sendModalSubmit, sendPing } from './handlers';
import { CommandInteraction, ComponentInteraction } from '../structures';

export interface InteractionData<T> {
  client: Client;
  interaction: T;
  reply: FastifyReply;
}

export interface ResolvedComponent {
  interaction: ComponentInteraction;
  customId: string[];
}

export type ComponentCallback = (
  interaction: ComponentInteraction,
  customId: string[],
  end: () => void,
) => void;

export interface PendingComponents {
  resolve: (value: ResolvedComponent) => void;
  timer: NodeJS.Timeout;
  memberId?: string;
  collector?: {
    callback: ComponentCallback;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reject: (reason?: any) => void;
    timeout: number;
    ended: boolean;
  }
}

export class InteractionHandler {
  private publicKey: Buffer;
  pendingComponents = new Map<string, PendingComponents>();

  constructor(private client: Client) {
    this.publicKey = Buffer.from(client.config.publicKey, 'hex');

    this.client.server.post('/interactions', {}, this.handleInteraction.bind(this));
  }

  async handleInteraction (request: FastifyRequest & { body: RawBody }, reply: FastifyReply) {
    const { isVerified, body } = this.verifyRequest(request);

    if (!isVerified) return reply.status(401).send({ error: 'invalid request signature' });

    switch (body.type) {
    case InteractionType.Ping: {
      await sendPing({
        client: this.client,
        interaction: body,
        reply,
      });

      break;
    }

    case InteractionType.ApplicationCommand: {
      await sendCommand({
        client: this.client,
        interaction: new CommandInteraction(this.client, body, reply),
        reply,
      });

      break;
    }

    case InteractionType.MessageComponent: {
      await sendComponent({
        client: this.client,
        interaction: new ComponentInteraction(this.client, body, reply),
        reply,
      });

      break;
    }

    case InteractionType.ApplicationCommandAutocomplete: {
      await sendAutocomplete({
        client: this.client,
        interaction: body,
        reply,
      });

      break;
    }

    case InteractionType.ModalSubmit: {
      await sendModalSubmit({
        client: this.client,
        interaction: body,
        reply,
      });

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
