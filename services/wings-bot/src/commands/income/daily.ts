import { Command, CommandData } from '../../structures';

export class DailyCommand extends Command {
  description = 'Get a batch of 🍖2,500.';
  cooldown = 1000 * 60 * 60 * 24;

  async run({ interaction }: CommandData<DailyCommand>) {
    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);

    await this.client.modules.economy.editBalance(interaction.member.id, 2500 * multiplier);
    interaction.success(`You collected your daily ${this.client.modules.economy.parseInt(2500 * multiplier)}`);
  }
}
