export class InteractionTimeoutError extends Error {
  public name = 'interactionTimeoutError';

  constructor(message: string) {
    super(message);
    this.message = message;
  }
}
