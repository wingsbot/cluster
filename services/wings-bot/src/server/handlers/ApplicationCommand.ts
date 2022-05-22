import type { APIApplicationCommandInteraction } from "discord-api-types/v10";
import type { InteractionData } from "../InteractionHandler";

export default async function({ client, interaction, reply }: InteractionData<APIApplicationCommandInteraction>) {
  console.log(interaction)
}
