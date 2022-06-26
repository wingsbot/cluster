import { InteractionTimeoutError } from '../../lib/framework';
import type { ComponentInteraction } from '../../structures';
import type { InteractionData } from '../InteractionHandler';

export default async function({ client, interaction }: InteractionData<ComponentInteraction>) {
  const customId = interaction.data.custom_id.split(':');
  const awaitComponent = client.routeHandler.interactionHandler.pendingComponents.get([...customId].pop());

  if (awaitComponent) {
    if (awaitComponent.memberId && awaitComponent.memberId !== interaction.member.id) {
      interaction.error('This component is already in use by another member.', true);
      return;
    }

    clearTimeout(awaitComponent.timer);

    customId.splice(-1, 1);

    if (awaitComponent.collector) {
      if (awaitComponent.collector.ended) {
        awaitComponent.resolve({ interaction, customId });
        return;
      }

      const end = () => {
        awaitComponent.collector.ended = true;
        this.client.routeHandler.interactionHandler.pendingComponents.delete(customId);
        awaitComponent.collector.reject(new InteractionTimeoutError('Prompt timed out!'));
      };


      const timer = setTimeout(() => {
        end();
      }, awaitComponent.collector.timeout);

      awaitComponent.timer = timer;
      awaitComponent.collector.callback(interaction, customId, end);
      return;
    }
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
