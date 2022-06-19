import { BlackjackUtil } from './util';
import { Args, Command, CommandData, CommandOptions } from '../../../structures';

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
    let totalBet = amount;

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

    const embed = {
      author: {
        name: interaction.member.tag,
        icon_url: interaction.member.avatarURL,
      },
      description: undefined,
      color: undefined,
      fields: [],
      footer: {
        text: `Your bet: ${this.client.modules.economy.parseInt(amount)}`,
      },
      timestamp: new Date().toISOString(),
    };

    const blackjack = new BlackjackUtil(this.client, {
      id: `${interaction.member.id}:blackjack`,
      type: 'blackjack',
      userId: interaction.member.id,
      messageLink: '',
    });

    await this.client.modules.economy.editBalance(interaction.member.id, -amount);

    blackjack.on('initiateGame', async (cards: BlackjackData) => {
      const { playerDeck } = cards;

      if (blackjack.handValue(playerDeck) !== 'blackjack') {
        blackjack.emit('runHands', cards);
        return;
      }

      blackjack.emit('endGame', cards);
    });

    blackjack.on('runHands', async (cards: BlackjackData) => {
      const { hands, playerDeck, opponentDeck } = cards;

      if (playerDeck.hand.length === 1) blackjack.hit(playerDeck.hand);

      if (blackjack.handValue(playerDeck) === 'blackjack') {
        if (this.client.utils.arraysEqual(playerDeck.hand, hands[hands.length - 1].hand)) {
          blackjack.sendAnswer('end', cards);
          return;
        }

        blackjack.sendAnswer('nextHand', cards);
        return;
      }

      if (blackjack.handValue(playerDeck) >= 21) {
        if (this.client.utils.arraysEqual(playerDeck.hand, hands[hands.length - 1].hand)) {
          blackjack.sendAnswer('end', cards);
          return;
        }

        blackjack.sendAnswer('nextHand', cards);
        return;
      }

      if (playerDeck.doubled) {
        blackjack.hit(playerDeck.hand);

        if (this.client.util.arraysEqual(playerDeck.hand, hands[hands.length - 1].hand)) {
          blackjack.sendAnswer('end', cards);
          return;
        }

        blackjack.sendAnswer('nextHand', cards);
        return;
      }

      const canDoubleDown = userData.balance >= totalBet + amount && playerDeck.hand.length === 2;
      const canSplit = userData.balance >= totalBet + amount
      && blackjack.handValue({ doubled: false, hand: [playerDeck.hand[0]] }) === blackjack.handValue({ doubled: false, hand: [playerDeck.hand[1]] })
      && playerDeck.hand.length === 2;

      const id = this.client.util.generateId();
      const componentBase = new MessageComponent()
        .addActionRow()
        .addButton({
          type: Constants.ComponentTypes.BUTTON,
          label: 'Hit',
          custom_id: `hit:${id}`,
          style: Constants.ButtonStyles.PRIMARY,
        })
        .addButton({
          type: Constants.ComponentTypes.BUTTON,
          label: 'Stand',
          custom_id: `stand:${id}`,
          style: Constants.ButtonStyles.PRIMARY,
        });

      if (canDoubleDown) componentBase.addButton({
        type: Constants.ComponentTypes.BUTTON,
        label: 'Double Down',
        custom_id: `doubleDown:${id}`,
        style: Constants.ButtonStyles.PRIMARY,
      });

      if (canSplit) componentBase.addButton({
        type: Constants.ComponentTypes.BUTTON,
        label: 'Split',
        custom_id: `split:${id}`,
        style: Constants.ButtonStyles.PRIMARY,
      });

      embed.fields = [{
        name: hands.length === 1
          ? '**Your hand**'
          : `**Hand ${hands.findIndex(deck => this.client.util.arraysEqual(deck.hand, playerDeck.hand)) + 1}**`,
        value: `${playerDeck.hand.join(' ')}\nTotal: \`${blackjack.isSoft(playerDeck) ? 'Soft ' : ''}${blackjack.handValue(playerDeck)}\``,
        inline: true,
      },
      {
        name: '\u200B',
        value: '\u200B',
        inline: true,
      },
      {
        name: '**Dealer hand**',
        value: `${opponentDeck.hand[0]} <:whatCardIsThis:777729431899996220>\nTotal: \`${blackjack.isSoft({ doubled: false, hand: [opponentDeck.hand[0]] }) ? 'Soft ' : ''}${blackjack.handValue({ doubled: false, hand: [opponentDeck.hand[0]] })}\``,
        inline: true,
      }];

      if (interaction.responded) {
        await component.editRaw({ embeds: [embed], components: componentBase.components });
      } else {
        await responder.sendRaw({ embeds: [embed], components: componentBase.components });

        const message = await interaction.getOriginalMessage();
        gameData.messageLink = message.jumpLink;
        gameData.messageId = message.id;

        this.client.activeGames.set(gameData.id, gameData);
      }

      let response: AwaitComponentReturn;
      try {
        response = await this.client.util.awaitComponent(interaction, responder, id);
      } catch (error) {
        if (error instanceof InteractionTimeoutError) {
          componentBase.disableAllComponents();

          responder.editRaw({
            embeds: [{
              description: 'You ran out of time :(',
            }],
            components: componentBase.components,
          });

          blackjack.endGame();
        }

        return;
      }

      component = response.responder;

      if (response.parsedId === 'stand' || blackjack.handValue(playerDeck) >= 21) {
        if (this.client.util.arraysEqual(playerDeck.hand, hands[hands.length - 1].hand)) {
          blackjack.sendAnswer('end', cards);
          return;
        }

        blackjack.sendAnswer('stand', cards);
      } else if (response.parsedId === 'hit') {
        blackjack.sendAnswer('hit', cards);
      } else if (response.parsedId === 'split' && canSplit) {
        totalBet += amount;
        hands.push({ doubled: false, hand: [playerDeck.hand.pop()] });
        blackjack.sendAnswer('split', cards);
      } else if (response.parsedId === 'doubleDown' && canDoubleDown) {
        totalBet += amount;
        hands[hands.findIndex(deck => this.client.util.arraysEqual(deck.hand, playerDeck.hand))].doubled = true;
        blackjack.sendAnswer('doubleDown', cards);
      }
    });

    blackjack.on('endGame', async (cards: BlackjackData) => {
      const { hands, playerDeck, opponentDeck } = cards;
      const result = blackjack.gameResult(blackjack.handValue(hands[0]), 0);
      const noHit = playerDeck.hand.length === 1 && result === 'bust';

      let hideHoleCard = true;
      let winnings = amount;
      embed.fields = [];

      // eslint-disable-next-line no-unmodified-loop-condition
      while ((blackjack.isSoft(opponentDeck) || blackjack.handValue(opponentDeck) < 17) && !noHit) {
        blackjack.hit(opponentDeck.hand);
      }

      const opponentValue = blackjack.handValue(opponentDeck);

      for (const [i, deck] of hands.entries()) {
        const playerValue = blackjack.handValue(deck);
        const result = blackjack.gameResult(playerValue, opponentValue);

        if (result !== 'bust') hideHoleCard = false;

        const lossOrGain = Math.floor((
          ['loss', 'bust'].includes(result) ? -1 : (result === 'push' ? 0 : 1))
        * (deck.doubled ? 2 : 1) * (playerValue === 'blackjack' ? 1.5 : 1) * amount);

        winnings += lossOrGain;

        const soft = blackjack.isSoft(deck);

        embed.fields.push({
          name: hands.length === 1 ? '**Your hand**' : `**Hand ${i + 1}**`,
          value: `${deck.hand.join(' ')}\nTotal: \`${soft ? 'Soft ' : ''}${playerValue}\``,
          inline: true,
        });
      }

      embed.fields.push({
        name: '\u200B',
        value: '\u200B',
      },
      {
        name: '**Dealer hand**',
        value: `${hideHoleCard ? `${opponentDeck.hand[0]} <:whatCardIsThis:777729431899996220>` : opponentDeck.hand.join(' ')}\nTotal: \`${hideHoleCard ? blackjack.handValue({ doubled: false, hand: [opponentDeck.hand[0]] }) : opponentValue}\``,
      });

      embed.color = winnings > amount ? responder.colors.green : (winnings < amount ? responder.colors.red : responder.colors.blue);

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

      await responder.editRaw({ embeds: [embed], components: [] });
      blackjack.endGame();
    });

    blackjack.startGame();
  }

  private generateEmbed() {}

  private generateComponents() {}
}
