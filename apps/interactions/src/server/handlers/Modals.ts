import { APIModalSubmitInteraction } from 'discord-api-types/v10';
import type { InteractionData } from '../InteractionHandler';

export default async function({ interaction }: InteractionData<APIModalSubmitInteraction>) {
  console.log(interaction);
}
