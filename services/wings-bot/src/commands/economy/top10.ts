import type { User } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Top10 extends CommandBase {
  description = 'Grabs the top 10 best players';

  exec = async ({ responder }: CommandData) => {
    const topTen = await this.client.modules.economy.getTopTen();
    const parsedMembers = await Promise.all(topTen.map(async (user, i) => {
      let userInfo: User;
      let deletedUser: string;

      try {
        userInfo = await this.client.fetchUser(user.id);
      } catch {
        deletedUser = 'Deleted User';
      }

      return `${i + 1}. ${userInfo?.tag || deletedUser} - ${this.client.modules.economy.parseInt(user.summed)}`;
    }));

    responder.sendEmbed({
      title: 'Top 10 Leaderboard',
      description: `\`\`\`\n${parsedMembers.join('\n')}\`\`\``,
      timestamp: new Date().toISOString(),
    });
  };
}
