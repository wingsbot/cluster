import { CommandBase, CommandData } from '../../lib/framework';

export default class Daily extends CommandBase {
  description = 'Get a batch of 🍖2,500.';
  cooldown = 1000 * 60 * 60 * 24;

  exec = async ({ cooldown, interaction, responder }: CommandData) => {
    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);

    await this.client.modules.economy.editBalance(interaction.member.id, 2500 * multiplier);
    responder.success(`You collected your daily ${this.client.modules.economy.parseInt(2500 * multiplier)}`);
    cooldown.setCooldown();
  };
}
