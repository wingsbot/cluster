export class InteractionTimeoutError extends Error {
  name = 'interactionTimeoutError';

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
