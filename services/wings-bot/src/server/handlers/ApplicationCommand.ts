import type { CommandInteraction } from "../../structures";
import type { InteractionData } from "../InteractionHandler";

export default async function({ client, interaction, reply }: InteractionData<CommandInteraction>) {
  console.log(interaction)
}
