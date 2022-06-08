import { Command, CommandOptions, Args, CommandData } from '../../structures';


export class DepositCommand extends Command {
  description = 'Put your money in the bank!';
  options = new CommandOptions()
    .addOption(Args.subCommand('custom', 'Input the amount of Wings you want to deposit.')
      .addOption(Args.number('amount', 'The amount of Wings you want to deposit', { required: true })),
    )
    .addOption(Args.subCommand('all', 'Deposits all the Wings in your balance.'))
    .addOption(Args.subCommand('half', 'Deposits half of the Wings in your balance.'));

  async run({ interaction, options }: CommandData<DepositCommand>) {
    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    let amount: number;

    if (options.get('all')) amount = Number(userData.balance);
    else if (options.get('half')) amount = Math.floor(Number(userData.balance) / 2);
    else amount = options.get('custom').get('amount');

    if (amount === 0 && userData.balance === 0n) {
      interaction.error('You don\'t have any Wings in your wallet! Collect some and try again.', true);
      return;
    }

    if (amount <= 0) {
      interaction.error('You specified an invalid amount', true);
      return;
    }

    if (userData.balance < amount) {
      interaction.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to deposit.`, true);
      return;
    }

    if (userData.bankCap === userData.bank) {
      interaction.error('You already hit the max bank limit! Upgrade it by doing `/buy Bank Upgrade`', true);
      return;
    }

    const bankCheckAmount = userData.bankCap - userData.bank;
    if (amount >= bankCheckAmount) {
      await this.client.modules.economy.editBalance(interaction.member.id, -bankCheckAmount);
      await this.client.modules.economy.editBank(interaction.member.id, bankCheckAmount);

      interaction.success(`Deposited **${this.client.modules.economy.parseInt(bankCheckAmount)}** into Wings Bank.\n> You hit the max bank limit! Upgrade it by doing \`/buy Bank Upgrade\``);
      return;
    }

    await this.client.modules.economy.editBalance(interaction.member.id, -amount);
    await this.client.modules.economy.editBank(interaction.member.id, amount);

    interaction.success(`Deposited **${this.client.modules.economy.parseInt(amount)}** into Wings Bank.`);
  }
}
