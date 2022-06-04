import * as Args from '../../structures/bot/Arguments';
import { Command, CommandData, CommandOptions } from '../../structures';

export class BalanceCommand extends Command {
  public description = 'Check how much wings you got.';
  public options = new CommandOptions()
    .addOption(Args.user('user', 'Check how much Wings somone else has.', {
      required: false
    }));


  public run = async ({ interaction, options }: CommandData<BalanceCommand>) => {
    console.log(interaction)
    const userId = options?.get('user') ?? interaction.member.id;
    /*
    const userData = await this.client.modules.economy.getUserData(userId);
    const activeItems = await this.client.modules.economy.getActiveItems(userId);
    const user = await this.client.fetchUser(userId);
*/
    interaction.send('', { embeds: [{
      author: {
        name: `${interaction.member.username}'s Wings`,
        icon_url: interaction.member.avatarURL,
      },
      description: `
      __**Balance**:__ test
      __**Bank**:__ test1
      __**Total**:__ test2`,
      fields: [{
        name: 'Active Items',
        value: 'None',
      }],
    }
  ]});
  };
}
