import { Command, CommandOptions, Args, CommandData } from '../../structures';

export class WithdrawCommand extends Command {
  description = 'Take your money out of the bank!';
  options = new CommandOptions()
    .addOption(Args.subCommand('custom', 'Input the amount of Wings you want to withdraw.')
      .addOption(Args.number('amount', 'The amount of Wings you want to withdraw', { required: true })),
    )
    .addOption(Args.subCommand('all', 'Withdraws all the Wings in your bank.'))
    .addOption(Args.subCommand('half', 'Withdraws half of the Wings in your bank.'));


  async run({ interaction, options }: CommandData<WithdrawCommand>) {
    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    let amount: number;

    if (options.get('all')) amount = Number(userData.bank);
    else if (options.get('half')) amount = Math.floor(Number(userData.bank) / 2);
    else amount = options.get('custom').get('amount');

    if (amount === 0 && userData.bank === 0) {
      interaction.error('You don\'t have any Wings in your bank!', true);
      return;
    }

    if (amount <= 0) {
      interaction.error('You specified an invalid amount', true);
      return;
    }

    if (userData.bank < amount) {
      interaction.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to withdraw.`, true);
      return;
    }

    await this.client.modules.economy.editBank(interaction.member.id, -amount);
    await this.client.modules.economy.editBalance(interaction.member.id, amount);

    interaction.success(`Withdrew **${this.client.modules.economy.parseInt(amount)}** from Wings Bank.`);
  }
}
