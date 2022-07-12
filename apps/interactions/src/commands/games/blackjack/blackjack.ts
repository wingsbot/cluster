import { BlackjackData, BlackjackUtil, DealerHand, PlayerHand } from './util';
import { Args, Command, CommandData, CommandOptions, MessageComponent } from '../../../structures';
import { InteractionTimeoutError } from '../../../lib/framework';
import { APIEmbed, ButtonStyle, ComponentType } from 'discord-api-types/v10';
import { ResolvedComponent } from 'src/server/InteractionHandler';

export class BlackjackCommand extends Command {
  description = 'Play blackjack against Wings.';
  options = new CommandOptions()
    .addOption(Args.number('bet', 'How many wings do you want to bet?', { required: true }));


  async run({ interaction, options }: CommandData<BlackjackCommand>) {
    const userGame = this.client.activeGames.get(`${interaction.user.id}:blackjack`);
    if (userGame) {
      interaction.send('', { embeds: [{
        author: {
          name: interaction.user.tag,
          icon_url: interaction.user.avatarURL,
        },
        title: 'You already have an active blackjack game!',
        color: this.client.utils.colors.red,
      }],
      components: [{
        type: ComponentType.ActionRow,
        components: [{
          type: ComponentType.Button,
          label: 'Go to active game',
          style: ButtonStyle.Link,
          url: userGame.messageLink,
        }],
      }],
      });

      return;
    }

    const userData = await this.client.modules.economy.getUserData(interaction.user.id);
    const bet = options.get('bet');
    let totalBet = bet;

    if (userData.balance === 0) {
      interaction.error('You don\'t have any Wings in your wallet! Collect some and try again.', true);
      return;
    }

    if (bet <= 0) {
      interaction.error('You specified an invalid amount', true);
      return;
    }

    if (userData.balance < bet) {
      interaction.error(`You don't have **${this.client.modules.economy.parseInt(bet)}** to bet.`, true);
      return;
    }

    const blackjack = new BlackjackUtil();
    const uniqueId = this.client.utils.generateId();
    await this.client.modules.economy.editBalance(interaction.user.id, -bet);

    blackjack.on('initiateGame', async(data: BlackjackData) => {
      const { playersHand, dealersHand, allPlayersHands } = data;

      if (playersHand.handValue === 21) {
        blackjack.sendAnswer('end', data);
        return;
      }

      const canDoubleDown = userData.balance >= totalBet + bet && playersHand.cards.length === 2;
      const canSplit = userData.balance >= totalBet + bet &&
        playersHand.cards[0].value ===  playersHand.cards[1].value &&
        playersHand.cards.length === 2;

      const components = this.generateComponents(uniqueId, canDoubleDown, canSplit);
      const embeds: APIEmbed[] = [{
        author: {
          name: interaction.user.tag,
          icon_url: interaction.user.avatarURL,
        },
        fields: [{
          name: allPlayersHands.length === 1
            ? '**Your hand**'
            : `**Hand ${allPlayersHands.findIndex(player => this.client.utils.arraysEqual(player.cards, playersHand.cards)) + 1}**`,
          value: `${playersHand.cards.map(c => c.emoji).join(' ')}\nTotal: \`${blackjack.isSoft(playersHand.cards) ? 'Soft ' : ''}${playersHand.handValue}\``,
          inline: true,
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: true,
        },
        {
          name: '**Dealer hand**',
          value: `${dealersHand.cards[0].emoji} <:whatCardIsThis:777729431899996220>\nTotal: \`${blackjack.isSoft(dealersHand.cards) ? 'Soft ' : ''}${dealersHand.cards[0].value}\``,
          inline: true,
        }],
        footer: {
          text: `Your bet: ${this.client.modules.economy.parseInt(totalBet)}`,
        },
        timestamp: new Date().toISOString(),
      }];

      interaction.send('', {
        embeds,
        components,
      });

      const message = await interaction.getOriginalMessage();

      this.client.activeGames.set(`${interaction.user.id}:blackjack`,  {
        type: 'blackjack',
        userId: interaction.user.id,
        messageLink: message.messageLink,
      });

      blackjack.emit('runHands', data);
    });

    blackjack.on('runHands', async(data: BlackjackData) => {
      const { allPlayersHands, playersHand, dealersHand } = data;

      let responses: ResolvedComponent;
      try {
        responses = await interaction.awaitComponent(uniqueId, 60_000, interaction.user.id);
      } catch (error) {
        if (error instanceof InteractionTimeoutError) {
          interaction.error('You took too long to play, you lost as a default.', true);
          return;
        }
      }

      switch(responses.customId[0]) {
      case 'hit':
        blackjack.sendAnswer('hit', data);
        break;

      case 'stand':
        blackjack.sendAnswer('stand', data);
        break;

      case 'doubleDown':
        totalBet += bet;
        blackjack.sendAnswer('doubleDown', data);
        break;

      case 'split':
        totalBet += bet;
        blackjack.sendAnswer('split', data);
        break;
      }

      if (!playersHand) { // when all the hands when spitting are done.
        blackjack.sendAnswer('end', data);
        return;
      }

      if (playersHand.cards.length === 1) playersHand.hit(); // adds a card (mainly when splitting happened)

      if (playersHand.handValue >= 21) { // bust or got 21, stand to go to next hand
        blackjack.sendAnswer('stand', data);
        return;
      }

      const canDoubleDown = userData.balance >= totalBet + bet && playersHand.cards.length === 2;
      const canSplit = userData.balance >= totalBet + bet &&
        playersHand.cards[0].value ===  playersHand.cards[1].value &&
        playersHand.cards.length === 2;

      const components = this.generateComponents(uniqueId, canDoubleDown, canSplit);
      const embeds: APIEmbed[] = [{
        author: {
          name: interaction.user.tag,
          icon_url: interaction.user.avatarURL,
        },
        fields: [{
          name: allPlayersHands.length === 1
            ? '**Your hand**'
            : `**Hand ${allPlayersHands.findIndex(player => this.client.utils.arraysEqual(player.cards, playersHand.cards)) + 1}**`,
          value: `${playersHand.cards.map(c => c.emoji).join(' ')}\nTotal: \`${blackjack.isSoft(playersHand.cards) ? 'Soft ' : ''}${playersHand.handValue}\``,
          inline: true,
        },
        {
          name: '\u200B',
          value: '\u200B',
          inline: true,
        },
        {
          name: '**Dealer hand**',
          value: `${dealersHand.cards[0].emoji} <:whatCardIsThis:777729431899996220>\nTotal: \`${blackjack.isSoft(dealersHand.cards) ? 'Soft ' : ''}${dealersHand.cards[0].value}\``,
          inline: true,
        }],
        footer: {
          text: `Your bet: ${this.client.modules.economy.parseInt(totalBet)}`,
        },
        timestamp: new Date().toISOString(),
      }];


      responses.interaction.edit('', {
        embeds,
        components,
      });
    });

    blackjack.on('endGame', async(data: BlackjackData) => {
      const { allPlayersHands, playersHand, dealersHand } = data;
      const result = blackjack.gameResult(blackjack.handValue(hands[0]), 0);
      const noHit = playerDeck.length === 1 && result === 'bust';
      let hideHoleCard = true;
      let winnings = bet;

      dealersHand.finish();

      const opponentValue = blackjack.handValue(opponentDeck);
      const embed: APIEmbed = {
        author: {
          name: interaction.user.tag,
          icon_url: interaction.user.avatarURL,
        },
      };

      hands.forEach((hand: any, i: number) => {
        const playerValue = blackjack.handValue(hand);
        const result = this.gameResult(playerValue, opponentValue);

        if (result !== 'bust') hideHoleCard = false;

        const lossOrGain = Math.floor((['loss', 'bust'].includes(result) ?
          -1 : (result === 'push' ?
            0 : 1)) * (hand.doubled ? 2 : 1) * (playerValue === 'blackjack' ?
          1.5 : 1) * bet);

        winnings += lossOrGain;

        const soft = blackjack.isSoft(hand);
        embed.fields.push({
          name: hands.length === 1 ? '**Your hand**' : `**Hand ${i + 1}**`,
          value: `${hand.join(' ')}\nTotal: \`${soft ? 'Soft ' : ''}${playerValue}\``,
          inline: true,
        });
      });

      embed.fields.push({
        name: '\u200B',
        value: '\u200B',
      });

      embed.fields.push({
        name: '**Dealer hand**',
        value: `${hideHoleCard ? `${opponentDeck[0]} <:__:788543289375588363>` : opponentDeck.join(' ')}\nTotal: \`${hideHoleCard ? blackjack.handValue([opponentDeck[0]]) : opponentValue}\``,
      });

      // tslint:disable-next-line: max-line-length
      embed.color = winnings > bet ? Util.colors.success : (winnings < bet ? Util.colors.error : Util.colors.info);
      embed.description = `You ${winnings === bet ? `broke even and got your **${currency}** back.` : `${winnings > bet ? 'won' : 'lost'} **${this.bot.currency.parse(currency, Math.abs(winnings - bet).toLocaleString())}**`}`;
      // tslint:disable-next-line: max-line-length
      embed.footer.text = `You now have ${this.bot.currency.parse(currency, ((userData.balance - bet) + winnings).toLocaleString())}`;

      await (winnings !== bet ? this.bot.currency.editBalance(message.guildId, message.author.id, winnings) : this.bot.currency.editBalance(message.guildId, message.author.id, bet));

      interaction.sendEmbed(embed);
      blackjack.endGame(data);
    });

    blackjack.startGame();
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
