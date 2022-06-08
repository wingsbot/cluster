import { Command, CommandData, CommandOptions, Args } from '../../structures';

export class BalanceCommand extends Command {
  description = 'Check how much wings you got.';
  options = new CommandOptions()
    .addOption(Args.user('user', 'Check how much Wings somone else has.', {
      required: false,
    }));


  async run({ interaction, options }: CommandData<BalanceCommand>) {
    const user = options?.get('user') ?? interaction.member;

    const userData = await this.client.modules.economy.getUserData(user.id);
    // const activeItems = await this.client.modules.economy.getActiveItems(user.id);

    interaction.sendEmbed({
      author: {
        name: `${user.username}'s Wings`,
        icon_url: user.avatarURL,
      },
      description: `
        __**Balance**:__ ${this.client.modules.economy.parseInt(userData.balance)}
        __**Bank**:__ ${this.client.modules.economy.parseInt(userData.bank)}/${this.client.modules.economy.parseInt(userData.bankCap)}
        __**Total**:__ ${this.client.modules.economy.parseInt(userData.balance + userData.bank)}`,
      fields: [{
        name: 'Active Items',
        value: /* activeItems.length > 0 ? activeItems.map(item => `${item.name} - <t:${Math.floor((item.timeUsed.getTime() + item.usageTime) / 1000)}:R>`).join('\n') : */ 'None',
      }],
    });
  }
}
