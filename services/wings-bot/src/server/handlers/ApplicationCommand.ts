import type { CommandInteraction } from "../../structures";
import type { InteractionData } from "../InteractionHandler";

export default async function({ client, interaction, reply }: InteractionData<CommandInteraction>) {
  try {
  await interaction.respond('', { embeds: [
    {
      title: 'test',
      description: 'yah lol'
    }
  ]});
  await interaction.respond('ok bet this is followed up');
  } catch (error) {
    console.error(error);
  }
}
