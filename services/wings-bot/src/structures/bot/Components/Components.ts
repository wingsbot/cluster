import type { Client } from '../../..';
import { ComponentInteraction } from '../../discord';

export interface ComponentData {
  interaction: ComponentInteraction;
}

export class Components {
  constructor(public client: Client, public name: string) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async run(context: ComponentData) {
    throw new Error(`Component ${this.name} does not have a run function >:(`);
  }
}
