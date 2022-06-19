import { Command, CommandData, User } from '../../structures';

export class Top10Command extends Command {
  description = 'Grabs the top 10 best players';

  async run({ interaction }: CommandData<Top10Command>) {
    const topTen = await this.client.modules.economy.getTopTen();
    const parsedMembers = await Promise.all(topTen.map(async (user, i) => {
      let userInfo: User;
      let deletedUser: string;
      try {
        userInfo = await this.client.utils.fetchUser(user.id);
      } catch {
        deletedUser = 'Deleted User';
      }

      return `${i + 1}. ${userInfo?.tag ?? deletedUser} - ${this.client.modules.economy.parseInt(user.summed)}`;
    }));

    interaction.sendEmbed({
      title: 'Top 10 Leaderboard',
      description: `\`\`\`\n${parsedMembers.join('\n')}\`\`\``,
      timestamp: new Date().toISOString(),
    });
  }
}
