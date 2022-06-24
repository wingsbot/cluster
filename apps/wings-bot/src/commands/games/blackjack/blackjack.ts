import { BlackjackUtil } from './util';
import { Args, Command, CommandData, CommandOptions, MessageComponent } from '../../../structures';
import { InteractionTimeoutError } from 'src/lib/framework';

export default class BlackjackCommand extends Command {
  description = 'Play blackjack against Wings.';
  options = new CommandOptions()
    .addOption(Args.number('amount', 'How many wings do you want to bet?', { required: true }));


  async run({ interaction, options }: CommandData<BlackjackCommand>) {
    const userGame = this.client.activeGames.get(`${interaction.member.id}:blackjack`);
    if (userGame) {
      interaction.sendEmbed({
        author: {
          name: interaction.member.tag,
          icon_url: interaction.member.avatarURL,
        },
        title: 'You already have an active blackjack game!',
        description: `[Press me to go to game](${userGame.messageLink})`,
        color: this.client.utils.colors.red,
      }, true);

      return;
    }

    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    const amount = options.get('amount');
    const totalBet = amount;

    if (amount === 0 && userData.balance === 0) {
      interaction.error('You don\'t have any Wings in your wallet! Collect some and try again.', true);
      return;
    }

    if (amount <= 0) {
      interaction.error('You specified an invalid amount', true);
      return;
    }

    if (userData.balance < amount) {
      interaction.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to bet.`, true);
      return;
    }

    const blackjack = new BlackjackUtil();
    const { playersHand, dealersHand, playersHands } = blackjack.initiate();
    const uniqueId = this.client.utils.generateId();

    await this.client.modules.economy.editBalance(interaction.member.id, -amount);

    let canDoubleDown = userData.balance >= totalBet + amount && playersHand.hand.length === 2;
    let canSplit = userData.balance >= totalBet + amount
    && playersHand.hand[0].value === playersHand.hand[1].value
    && playersHand.hand.length === 2;

    let components = this.generateComponents(uniqueId, canDoubleDown, canSplit);
    const embed = {
      author: {
        name: interaction.member.tag,
        icon_url: interaction.member.avatarURL,
      },
      description: undefined,
      color: undefined,
      fields: [{
        name: playersHands.length === 1
          ? '**Your hand**'
          : `**Hand ${playersHands.findIndex(player => this.client.utils.arraysEqual(player.hand, playersHand.hand)) + 1}**`,
        value: `${playersHand.hand.map(c => c.emoji).join(' ')}\nTotal: \`${blackjack.isSoft(playersHand.hand) ? 'Soft ' : ''}${playersHand.handValue}\``,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: '**Dealer hand**',
        value: `${dealersHand.hand[0].emoji} <:whatCardIsThis:777729431899996220>\nTotal: \`${blackjack.isSoft(dealersHand.hand) ? 'Soft ' : ''}${(dealersHand.handValue as number) - dealersHand.hand[1].value}\``,
        inline: true,
      }],
      footer: {
        text: `Your bet: ${this.client.modules.economy.parseInt(amount)}`,
      },
      timestamp: new Date().toISOString(),
    };

    const message = await interaction.send('', { embeds: [embed], components });
    // TODO: message link
    this.client.activeGames.set(`${interaction.member.id}:blackjack`,  {
      type: 'blackjack',
      userId: interaction.member.id,
      messageLink: message.messageLink,
    });

    interaction.collectComponents(uniqueId, { memberId: interaction.member.id }, async (component, customId, end) => {
      switch(customId[0]) {
      case 'hit': {
        playersHand.hit();

        break;
      }

      case 'stand': {
        playersHand.stand();

        break;
      }

      case 'doubleDown': {
        playersHand.doubleDown();

        break;
      }

      case 'split': {
        playersHand.split();

        break;
      }
      }

      if (blackjack.ended) {
        let winnings = amount;
        let hideSecondCard = true;
        embed.fields = [];
        let i = 0;

        dealersHand.finish();

        for (const hand of playersHands) {
          const playerValue = hand.handValue;
          const result = blackjack.result(playerValue, dealersHand.handValue);

          if (result !== 'bust') hideSecondCard = false;

          const lossOrGain = Math.floor((
            ['loss', 'bust'].includes(result) ? -1 : (result === 'push' ? 0 : 1))
          * (hand.doubledDown ? 2 : 1) * (playerValue === 'blackjack' ? 1.5 : 1) * amount);

          winnings += lossOrGain;

          const soft = blackjack.isSoft(hand.hand);

          i++;
          embed.fields.push({
            name: playersHands.length === 1 ? '**Your hand**' : `**Hand ${i + 1}**`,
            value: `${hand.hand.map(c => c.emoji).join(' ')}\nTotal: \`${soft ? 'Soft ' : ''}${playerValue}\``,
            inline: true,
          });
        }

        embed.fields.push({
          name: '\u200B',
          value: '\u200B',
          inline: true,
        },
        {
          name: '**Dealer hand**',
          value: `${hideSecondCard ? `${dealersHand.hand[0].emoji} <:whatCardIsThis:777729431899996220>` : dealersHand.hand.join(' ')}\nTotal: \`${hideSecondCard ? (dealersHand.handValue as number) - dealersHand.hand[1].value : dealersHand.handValue}\``,
          inline: true,
        });

        embed.color = winnings > amount ? this.client.utils.colors.green : (winnings < amount ? this.client.utils.colors.red : this.client.utils.colors.blue);

        if (winnings === amount) {
          embed.description = `You broke even and got your **${this.client.modules.economy.parseInt()}'s** back.`;

          await this.client.modules.economy.editBalance(interaction.member.id, amount);
        } else if (winnings > amount) {
          embed.description = `You won **${this.client.modules.economy.parseInt(winnings - amount)}**`;

          await this.client.modules.economy.editBalance(interaction.member.id, winnings);
        } else {
          embed.description = `You lost **${this.client.modules.economy.parseInt(winnings - amount)}**`;

          await this.client.modules.economy.editBalance(interaction.member.id, winnings);
        }

        embed.footer = {
          text: `You now have ${this.client.modules.economy.parseInt((Number(userData.balance) - amount) + winnings)}`,
        };

        await component.edit('', { embeds: [embed], components: [] });
        end();
        return;
      }

      if (playersHand.hand.length === 1) playersHand.hit();
      if (playersHand.handValue === 'blackjack' || playersHand.handValue >> 21) return 'ended';
      if (playersHand.doubledDown) playersHand.doubleDown();

      canDoubleDown = userData.balance >= totalBet + amount && playersHand.hand.length === 2;
      canSplit = userData.balance >= totalBet + amount
      && playersHand.hand[0].value === playersHand.hand[1].value
      && playersHand.hand.length === 2;


      embed.fields = [{
        name: playersHands.length === 1
          ? '**Your hand**'
          : `**Hand ${playersHands.findIndex(player => this.client.utils.arraysEqual(player.hand, playersHand.hand)) + 1}**`,
        value: `${playersHand.hand.map(c => c.emoji).join(' ')}\nTotal: \`${blackjack.isSoft(playersHand.hand) ? 'Soft ' : ''}${playersHand.handValue}\``,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: '**Dealer hand**',
        value: `${dealersHand.hand[0].emoji} <:whatCardIsThis:777729431899996220>\nTotal: \`${blackjack.isSoft(dealersHand.hand) ? 'Soft ' : ''}${dealersHand.handValue}\``,
        inline: true,
      }];

      components = this.generateComponents(uniqueId, canDoubleDown, canSplit);
      await component.edit('', { embeds: [embed], components });
    }).catch(error => {
      if (error instanceof InteractionTimeoutError) {
        interaction.send('You took to long to respond, to bad so sad.');
        return;
      }
    });
  }

  private generateComponents(uniqueId: string, canDoubleDown: boolean, canSplit: boolean) {
    const componentBase = new MessageComponent(uniqueId)
      .addButton('Hit', 'hit', 'grey')
      .addButton('Stand', 'stand', 'grey');

    if (canDoubleDown) componentBase.addButton('Double Down', 'doubleDown', 'grey');
    if (canSplit) componentBase.addButton('Split', 'split', 'grey');

    return componentBase.components;
  }
}
