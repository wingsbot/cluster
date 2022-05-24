import type { CommandInteraction } from "../../structures";
import type { InteractionData } from "../InteractionHandler";

export default async function({ client, interaction }: InteractionData<CommandInteraction>) {
  console.log(interaction);
}
