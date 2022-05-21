import { APIPingInteraction, InteractionResponseType } from "discord-api-types/v10";
import type { InteractionData } from "../InteractionHandler";

export default async function({ reply }: InteractionData<APIPingInteraction>) {
  reply.send({ status: 200, data: { type: InteractionResponseType.Pong } });
}