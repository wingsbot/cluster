import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Rob extends CommandBase {
  public description = 'Take someones Wings... If you can 👀';
  public cooldown = 1000 * 60 * 60 * 4;

  public options: ApplicationCommandOptions[] = [{
    type: Constants.ApplicationCommandOptionTypes.USER,
    name: 'user',
    description: 'Select a user',
    required: true,
  }];

  public exec = async ({ cooldown, interaction, responder, options }: CommandData) => {
    const userId = options[0].value as string;
    const user = await this.client.fetchUser(userId);

    const robbeeData = await this.client.modules.economy.getUserData(userId);
    const robberStopper = await this.client.modules.economy.getActiveItem(userId, 'robberstopper');

    const userData = await this.client.modules.economy.getUserData(interaction.member.id);

    const randomNumber = Math.random();
    let robAmount: number;

    if (robbeeData.balance < 250) {
      responder.send(`**${user.tag}** barely has anything... Kinda fucked up 😐`);
      return;
    }

    if (randomNumber < 0.8) {
      if ((Number(userData.balance) * 0.05) < 500) robAmount = 500;
      else robAmount = Math.round(Number(userData.balance) * 0.05);

      responder.send(`You were caught tryna steal 👮🚔\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
      await this.client.modules.economy.editBalance(interaction.member.id, -robAmount);
    } else if (randomNumber < 0.9) {
      if (robberStopper) {
        if ((Number(userData.balance) * 0.05) < 500) robAmount = 500;
        else robAmount = Number(userData.balance) * 0.05;

        responder.send(`**${user.tag}** had an active robber stopper!\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
        cooldown.setCooldown();
        return;
      }

      robAmount = Math.round(Number(robbeeData.balance) * 0.3);

      await this.client.modules.economy.editBalance(interaction.member.id, robAmount);
      await this.client.modules.economy.editBalance(userId, -robAmount);

      responder.send(`**${interaction.member.tag}** slips their hand in **${user.tag}'s** bucket and stole **${this.client.modules.economy.parseInt(robAmount)}**!`);
    } else if (randomNumber < 0.98) {
      if (robberStopper) {
        if ((Number(userData.balance) * 0.05) < 500) robAmount = 500;
        else robAmount = Math.round(Number(userData.balance) * 0.05);

        responder.send(`**${user.tag}** had an active robber stopper!\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
        cooldown.setCooldown();
        return;
      }

      robAmount = Math.round(Number(robbeeData.balance) * 0.5);

      await this.client.modules.economy.editBalance(interaction.member.id, robAmount);
      await this.client.modules.economy.editBalance(userId, -robAmount);

      responder.send(`**${interaction.member.tag}** slips their hand in **${user.tag}'s** suitcase and stole **${this.client.modules.economy.parseInt(robAmount)}**!`);
    } else {
      if (robberStopper) {
        if ((Number(userData.balance) * 0.05) < 500) robAmount = 500;
        else robAmount = Math.round(Number(userData.balance) * 0.05);

        responder.send(`**${user.tag}** had an active robber stopper!\n> You were fined **${this.client.modules.economy.parseInt(robAmount)}**`);
        cooldown.setCooldown();
        return;
      }

      robAmount = Math.round(Number(robbeeData.balance) * 0.9);

      await this.client.modules.economy.editBalance(interaction.member.id, robAmount);
      await this.client.modules.economy.editBalance(userId, -robAmount);

      responder.send(`**${interaction.member.tag}** slips their hand in **${user.tag}'s** LIFE SAVINGS stole **${this.client.modules.economy.parseInt(robAmount)}**!`);
    }

    cooldown.setCooldown();
  };
}
