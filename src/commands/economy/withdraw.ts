import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Withdraw extends CommandBase {
  public description = 'Take your money out of the bank!';
  public options: ApplicationCommandOptions[] = [{
    name: 'custom',
    description: 'Input the amount of Wings you want to withdraw.',
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [{
      name: 'amount',
      description: 'The amount of Wings you want to withdraw',
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
      required: true,
    }],
  },
  {
    name: 'all',
    description: 'Withdraws all the Wings in your balance.',
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [],
  },
  {
    name: 'half',
    description: 'Withdraws half of the Wings in your balance.',
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [],
  }];

  public exec = async ({ interaction, responder, options }: CommandData) => {
    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    let amount: number;

    if (options[0].name === 'all') amount = userData.bank;
    else if (options[0].name === 'half') amount = Math.round(userData.bank / 2);
    else amount = options[0].options[0].value as number;

    if (amount === 0 && userData.bank === 0) {
      responder.error('You don\'t have any Wings in your bank!', true);
      return;
    }

    if (amount <= 0) {
      responder.error('You specified an invalid amount', true);
      return;
    }

    if (userData.bank < amount) {
      responder.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to withdraw.`, true);
      return;
    }

    await this.client.modules.economy.editBank(interaction.member.id, -amount);
    await this.client.modules.economy.editBalance(interaction.member.id, amount);

    responder.success(`Withdrew **${this.client.modules.economy.parseInt(amount)}** from Wings Bank.`);
  };
}
