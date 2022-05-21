import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Deposit extends CommandBase {
  public description = 'Put your money in the bank!';
  public options: ApplicationCommandOptions[] = [{
    name: 'custom',
    description: 'Input the amount of Wings you want to deposit.',
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [{
      name: 'amount',
      description: 'The amount of Wings you want to deposit',
      type: Constants.ApplicationCommandOptionTypes.INTEGER,
      required: true,
    }],
  },
  {
    name: 'all',
    description: 'Deposits all the Wings in your balance.',
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [],
  },
  {
    name: 'half',
    description: 'Deposits half of the Wings in your balance.',
    type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
    options: [],
  }];

  public exec = async ({ interaction, responder, options }: CommandData) => {
    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    let amount: number;

    if (options[0].name === 'all') amount = Number(userData.balance);
    else if (options[0].name === 'half') amount = Math.round(Number(userData.balance) / 2);
    else amount = options[0].options[0].value as number;

    if (amount === 0 && userData.balance === 0n) {
      responder.error('You don\'t have any Wings in your wallet! Collect some and try again.', true);
      return;
    }

    if (amount <= 0) {
      responder.error('You specified an invalid amount', true);
      return;
    }

    if (userData.balance < amount) {
      responder.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to deposit.`, true);
      return;
    }

    if (userData.bankCap === userData.bank) {
      responder.error('You already hit the max bank limit! Upgrade it by doing `/buy Bank Upgrade`', true);
      return;
    }

    const bankCheckAmount = userData.bankCap - userData.bank;
    if (amount >= bankCheckAmount) {
      await this.client.modules.economy.editBalance(interaction.member.id, -bankCheckAmount);
      await this.client.modules.economy.editBank(interaction.member.id, bankCheckAmount);

      responder.success(`Deposited **${this.client.modules.economy.parseInt(bankCheckAmount)}** into Wings Bank.\n> You hit the max bank limit! Upgrade it by doing \`/buy Bank Upgrade\``);
      return;
    }

    await this.client.modules.economy.editBalance(interaction.member.id, -amount);
    await this.client.modules.economy.editBank(interaction.member.id, amount);

    responder.success(`Deposited **${this.client.modules.economy.parseInt(amount)}** into Wings Bank.`);
  };
}
