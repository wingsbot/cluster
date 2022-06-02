import { ApplicationCommandOptionType } from 'discord-api-types/v10';
import * as Args from '../../structures/bot/Arguments';
import { Command, CommandData, CommandOptions } from '../../structures';

export class Balance extends Command {
  public description = 'Check how much wings you got.';
  public options = new CommandOptions()
    .addOption(Args.user('user', 'Check how much Wings somone else has.'));


  public exec = async ({ interaction, options }: CommandData<Balance>) => {
    const userId = options.get('') ?? interaction.user.id;
    const userData = await this.client.modules.economy.getUserData(userId);
    const activeItems = await this.client.modules.economy.getActiveItems(userId);
    const user = await this.client.fetchUser(userId);

    responder.sendEmbed({
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
        value: activeItems.length > 0 ? activeItems.map(item => `${item.name} - <t:${Math.floor((item.timeUsed.getTime() + Number(item.usageTime)) / 1000)}:R>`).join('\n') : 'None',
      }],
    });
  };
}
