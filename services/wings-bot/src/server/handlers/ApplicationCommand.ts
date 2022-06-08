import { CommandInteraction, CommandInteractionData, CommandInteractionDataOptions } from '../../structures';
import type { InteractionData } from '../InteractionHandler';

export default async function({ client, interaction }: InteractionData<CommandInteraction>) {
  const command = client.commands.get(interaction.data.name);

  try {
    const context = {
      interaction,
      ...interaction.data?.options && { options: interaction.data.options },
    };

    await command.run(context);
  } catch(error) {
    console.log(error);
  }
}
