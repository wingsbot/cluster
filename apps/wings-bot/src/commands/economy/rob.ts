import { Args, Command, CommandData, CommandOptions } from '../../structures';

export class RobCommand extends Command{
  description = 'Take someones Wings... If you can 👀';
  cooldown = 1000 * 60 * 60 * 4;
  options = new CommandOptions()
    .addOption(Args.user('user', 'select a user', { required: true }));

  async run({ interaction, options }: CommandData<RobCommand>) {
    const user = options.get('user');

    const robbeeData = await this.client.modules.economy.getUserData(user.id);
    const robberStopper = await this.client.modules.economy.getActiveItem(user.id, 'robberstopper');

    const userData = await this.client.modules.economy.getUserData(interaction.user.id);

    const randomNumber = Math.random();
    let robAmount: number;

    if (robbeeData.balance < 250) {
      interaction.send(`**${user.tag}** barely has anything... Kinda fucked up 😐`);
      return;
    }

    if (randomNumber < 0.8) {
      robAmount = (Number(userData.balance) * 0.05) < 500 ? 500 : Math.round(Number(userData.balance) * 0.05);

      interaction.send(`You were caught tryna steal 👮🚔\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
      await this.client.modules.economy.editBalance(interaction.user.id, -robAmount);
    } else if (randomNumber < 0.9) {
      if (robberStopper) {
        robAmount = (Number(userData.balance) * 0.05) < 500 ? 500 : Number(userData.balance) * 0.05;

        interaction.send(`**${user.tag}** had an active robber stopper!\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
        return;
      }

      robAmount = Math.round(Number(robbeeData.balance) * 0.3);

      await this.client.modules.economy.editBalance(interaction.user.id, robAmount);
      await this.client.modules.economy.editBalance(user.id, -robAmount);

      interaction.send(`**${interaction.user.tag}** slips their hand in **${user.tag}'s** bucket and stole **${this.client.modules.economy.parseInt(robAmount)}**!`);
    } else if (randomNumber < 0.98) {
      if (robberStopper) {
        robAmount = (Number(userData.balance) * 0.05) < 500 ? 500 : Math.round(Number(userData.balance) * 0.05);

        interaction.send(`**${user.tag}** had an active robber stopper!\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
        return;
      }

      robAmount = Math.round(Number(robbeeData.balance) * 0.5);

      await this.client.modules.economy.editBalance(interaction.user.id, robAmount);
      await this.client.modules.economy.editBalance(user.id, -robAmount);

      interaction.send(`**${interaction.user.tag}** slips their hand in **${user.tag}'s** suitcase and stole **${this.client.modules.economy.parseInt(robAmount)}**!`);
    } else {
      if (robberStopper) {
        robAmount = (Number(userData.balance) * 0.05) < 500 ? 500 : Math.round(Number(userData.balance) * 0.05);

        interaction.send(`**${user.tag}** had an active robber stopper!\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
        return;
      }

      robAmount = Math.round(Number(robbeeData.balance) * 0.9);

      await this.client.modules.economy.editBalance(interaction.user.id, robAmount);
      await this.client.modules.economy.editBalance(user.id, -robAmount);

      interaction.send(`**${interaction.user.tag}** slips their hand in **${user.tag}'s** LIFE SAVINGS stole **${this.client.modules.economy.parseInt(robAmount)}**!`);
    }
  }
}
