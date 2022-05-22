import { APIPingInteraction, InteractionResponseType } from "discord-api-types/v10";
import type { InteractionData } from "../InteractionHandler";

export default async function({ reply }: InteractionData<APIPingInteraction>) {
  reply.status(200).send({ type: InteractionResponseType.Pong });
}