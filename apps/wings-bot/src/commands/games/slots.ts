import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Slots extends CommandBase {
  description = 'Are you lucky? Play some slots and find out!';

  options: ApplicationCommandOptions[] = [{
    name: 'bet',
    description: 'Amount of Wings you want to bet',
    type: Constants.ApplicationCommandOptionTypes.INTEGER,
    required: true,
  }];

  private readonly combinations = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8]];
  private readonly reels = [
    ['🍒', '💰', '⭐', '🍖', '💎', '❤', '🎉'],
    ['🍖', '💎', '❤', '🍒', '🎉', '⭐', '💰'],
    ['❤', '💎', '⭐', '🍒', '💰', '🎉', '🍖'],
  ];

  private readonly values = {
    '🍖': 100,
    '💎': 50,
    '💰': 25,
    '❤': 25,
    '⭐': 10,
    '🎉': 10,
    '🍒': 10,
  };

  private generateRoll() {
    const roll = [];

    // eslint-disable-next-line unicorn/no-array-for-each
    this.reels.forEach((reel, index) => {
      const random = Math.floor(Math.random() * reel.length);
      roll[index] = random === 0 ? reel[reel.length - 1] : reel[random - 1];
      roll[index + 3] = reel[random];
      roll[index + 6] = random === reel.length - 1 ? reel[0] : reel[random + 1];
    });

    return roll as string[];
  }

  exec = async ({ interaction, options, responder }: CommandData) => {
    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    const amount = options[0].value as number;

    if (userData.balance === 0n) {
      responder.error('You don\'t have any Wings in your wallet! Collect some and try again.', true);
      return;
    }

    if (amount <= 0) {
      responder.error('You specified an invalid amount', true);
      return;
    }

    if (userData.balance < amount) {
      responder.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to bet.`, true);
      return;
    }

    if (amount < 1 || amount > 5000) {
      responder.error(`You can't bet less than ${this.client.modules.economy.parseInt(1)} or more than ${this.client.modules.economy.parseInt(5000)}.`, true);
      return;
    }

    const roll = this.generateRoll();
    const embed = {
      author: {
        name: `${interaction.member.tag} pulled the lever...`,
        icon_url: interaction.member.avatarURL,
      },
      color: responder.colors.default,
      description: '__🎰\u00A0\u00A0\u00A0\u00A0\u00A0Slots\u00A0\u00A0\u00A0\u00A0\u00A0🎰__\n'
        + `__| ${roll[0]} | ${roll[1]} | ${roll[2]} |__\n`
        + `__| ${roll[3]} | ${roll[4]} | ${roll[5]} |__\n`
        + `__| ${roll[6]} | ${roll[7]} | ${roll[8]} |__\n\n`,
      timestamp: new Date().toISOString(),
      footer: {
        text: '',
      },
    };

    let winnings = 0;
    for (const combo of this.combinations) {
      if (roll[combo[0]] === roll[combo[1]] && roll[combo[1]] === roll[combo[2]]) {
        winnings += (this.values[roll[combo[0]]] * amount);
      }
    }

    if (winnings === 0) {
      embed.color = responder.colors.red;
      embed.description += 'You lost! Better luck next time 😎';
      embed.footer = {
        text: `You now have ${this.client.modules.economy.parseInt(Number(userData.balance) - amount)}`,
      };

      await this.client.modules.economy.editBalance(interaction.member.id, -amount);
    } else {
      embed.color = responder.colors.green;
      embed.description += `You won **${this.client.modules.economy.parseInt(winnings)}**! Play again!`;
      embed.footer = {
        text: `You now have ${this.client.modules.economy.parseInt(Number(userData.balance) - winnings)}`,
      };

      await this.client.modules.economy.editBalance(interaction.member.id, winnings);
    }

    responder.sendEmbed(embed);
  };
}
