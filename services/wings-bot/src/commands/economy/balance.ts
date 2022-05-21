import { Constants, ApplicationCommandOptions } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Balance extends CommandBase {
  public description = 'Check how much wings you got.';
  public options: ApplicationCommandOptions[] = [{
    name: 'user',
    description: 'Select a user',
    type: Constants.ApplicationCommandOptionTypes.USER,
    required: false,
  }];

  public exec = async ({ interaction, options, responder }: CommandData) => {
    const userId = options?.[0]?.value as string || interaction.member.id;
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
