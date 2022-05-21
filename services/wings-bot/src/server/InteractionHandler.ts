import { FastifyReply, FastifyRequest } from 'fastify';
import nacl from 'tweetnacl';
import { RouteHandler } from './routeHandler';

export class InteractionHandler {
  public route: RouteHandler;

  constructor(routeHandler: RouteHandler) {
    this.route = routeHandler;
  }

  handleInteraction (request: FastifyRequest, reply: FastifyReply) {
    const signature = request.headers['X-Signature-Ed25519'] as string;
    const timestamp = request.headers['X-Signature-Timestamp'] as string;
    const body = request.body; // rawBody is expected to be a string, not raw bytes
    console.log(body)

    const isVerified = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      this.route.publicKey
    );

    if (!isVerified) reply.send({ status: 401, error: 'invalid request signature' });
    else reply.send({ status: 200, type: 1 });
  }
}
