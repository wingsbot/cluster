import type { ComponentInteraction } from '../../structures';
import type { InteractionData } from '../InteractionHandler';

export default async function({ client, interaction }: InteractionData<ComponentInteraction>) {
  const customId = interaction.data.custom_id.split(':');
  console.log(client.routeHandler.interactionHandler);
  const awaitComponent = client.routeHandler.interactionHandler.pendingComponents.get([...customId].pop());

  if (awaitComponent) {
    if (awaitComponent.memberId && awaitComponent.memberId !== interaction.member.id) {
      interaction.error('This component is already in use by another member.', true);
      return;
    }

    clearTimeout(awaitComponent.timer);
    customId.splice(-1, 1);

    awaitComponent.resolve({ interaction, customId });
    return;
  }

  const component = client.components.get(interaction.message.interaction.name);

  try {
    await component.run({ interaction });
  } catch(error) {
    console.error(error);
  }
}
