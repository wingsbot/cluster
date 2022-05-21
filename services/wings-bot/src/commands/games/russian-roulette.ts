import { ApplicationCommandOptions, ComponentInteraction, Constants, Message } from 'eris';
import { CommandBase, CommandData, InteractionTimeoutError, AwaitComponentReturn } from '../../lib/framework';
import { MessageComponent, RussianUtil } from '../../lib/framework/utils';
import { GameData } from '../../lib/interfaces/Games';

// eslint-disable-next-line no-promise-executor-return
const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default class RussianRoulette extends CommandBase {
  public description = 'Be the last one standing.';

  public options: ApplicationCommandOptions[] = [{
    type: Constants.ApplicationCommandOptionTypes.INTEGER,
    name: 'amount',
    description: 'Amount to be put in the pot.',
    required: true,
  }];

  public exec = async ({ interaction, responder, options }: CommandData) => {
    const userGame = this.client.activeGames.get(`${interaction.guildID}:russian`);

    if (userGame) {
      responder.sendEmbed({
        author: {
          name: interaction.member.tag,
          icon_url: interaction.member.avatarURL,
        },
        title: 'You already have an active russian roulette game!',
        description: `[Press me to go to game](${userGame.messageLink})`,
        color: responder.colors.red,
      }, '', true);

      return;
    }

    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    const amount = options[0].value as number;

    if (amount === 0 && userData.balance === 0n) {
      responder.error('You don\'t have any Wings in your wallet! Collect some and try again.', true);
      return;
    }

    if (amount <= 0) {
      responder.error('You specified an invalid amount', true);
      return;
    }

    if (userData.balance < amount) {
      responder.error(`You don't have **${this.client.modules.economy.parseInt(amount)}** to play with.`, true);
      return;
    }

    const id = this.client.util.generateId();
    const componentBase = new MessageComponent()
      .addActionRow()
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        label: 'Start Game',
        custom_id: `startGame:${id}`,
        style: Constants.ButtonStyles.PRIMARY,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        label: 'Join Game',
        custom_id: `joinGame:${id}`,
        style: Constants.ButtonStyles.SUCCESS,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        label: 'Leave Game',
        custom_id: `leaveGame:${id}`,
        style: Constants.ButtonStyles.DANGER,
      });

    const embed = {
      title: 'Starting a game of Russian Roulette.',
      description: '1/6 players joined.',
      color: responder.colors.default,
      fields: [],
      footer: {
        text: `Price to join: ${this.client.modules.economy.parseInt(amount)}`,
      },
      timestamp: new Date().toISOString(),
    };

    await responder.sendRaw({ embeds: [embed], components: componentBase.components });
    const message = await interaction.getOriginalMessage();

    const gameData: GameData = {
      id: `${interaction.member.id}:russian`,
      type: 'russian',
      userId: interaction.member.id,
      guildId: interaction.guildID,
      channelId: interaction.channel.id,
      messageId: message.id,
      messageLink: message.jumpLink,
      data: {
        price: amount,
        pot: 0,
        membersInGame: [],
      },
    };

    const russianGame = new RussianUtil(this.client, gameData);

    russianGame.addPlayer(interaction.member.id);

    russianGame.on('initiateGame', async (gameData: GameData) => {
      let response: ComponentInteraction & AwaitComponentReturn;
      try {
        response = await this.client.util.awaitGlobalComponent(interaction, responder, id);
      } catch (error) {
        if (error instanceof InteractionTimeoutError) {
          responder.editRaw({
            embeds: [{
              description: `${responder.emojis.xmark} Game ended because you took too long to start.`,
            }],
            components: [],
          });

          russianGame.refund();
          russianGame.endGame();
        }

        return;
      }

      const userId = response.userId;

      if (response.parsedId === 'startGame') {
        if (userId !== gameData.userId) {
          response.responder.error(`You must ask <@${gameData.userId}> to start the game.`, true);
          russianGame.startGame();
          return;
        }

        if (gameData.data.membersInGame.length === 1) {
          response.responder.error('You can\'t play the game with youself... Silly', true);
          russianGame.startGame();
          return;
        }

        componentBase.disableAllComponents();
        response.responder.editRaw({ components: componentBase.components });
        russianGame.startRound();
      } else if (response.parsedId === 'joinGame') {
        const joinUserData = await this.client.modules.economy.getUserData(userId);

        if (joinUserData.balance < gameData.data.price) {
          response.responder.error(`You dont have enough **${this.client.modules.economy.parseInt()}'s** to join.`, true);
          russianGame.startGame();
          return;
        }

        if (gameData.data.membersInGame.includes(userId)) {
          response.responder.error('You already are in the game.', true);
          russianGame.startGame();
          return;
        }

        if (gameData.data.membersInGame.length + 1 === 6) componentBase.components[0].components[1].disabled = true;

        embed.description = `${gameData.data.membersInGame.length + 1}/6 players joined.`;
        responder.editRaw({ embeds: [embed], components: componentBase.components });

        russianGame.addPlayer(userId);
        response.responder.success('Successfully added you to the game', true);
      } else {
        russianGame.removePlayer(userId);

        if (gameData.data.membersInGame.length === 0) {
          responder.editRaw({
            embeds: [{
              description: 'Ended game because nobody wants to play :(',
            }],
            components: [],
          });

          russianGame.endGame();
          return;
        }

        response.responder.success('Successfully removed you to the game', true);
        russianGame.startGame();
      }
    });

    let round = 1;
    russianGame.on('startRound', async (gameData: GameData) => {
      if (gameData.data.membersInGame.length === 1) {
        responder.send(`<@${gameData.data.membersInGame[0]}> has survived and won **${this.client.modules.economy.parseInt(gameData.data.pot)}**`);

        this.client.modules.economy.editBalance(gameData.data.membersInGame[0], gameData.data.pot);
        russianGame.endGame();
        return;
      }

      const randomShot = this.client.util.getRandomInt(1, 6);

      responder.sendEmbed({
        title: `Starting round #${round} of Russian Roulette`,
        color: responder.colors.blue,
        description: `__People remaining:__\n${gameData.data.membersInGame.map(userId => `<@${userId}>`).join('\n')}`,
      });

      let userCount = 0;

      for (let i = 0; i < randomShot; i++) {
        if (userCount === gameData.data.membersInGame.length) userCount = 0;
        const user = await this.client.fetchUser(gameData.data.membersInGame[userCount]);

        userCount++;
        await sleep(4000);
        const message = await responder.send(`**${user.tag}** points the gun at themselves 😳`) as Message;
        await sleep(4000);

        if (i === randomShot - 1) {
          russianGame.eliminate(user.id);
          await responder.edit(`> **BANG!** ${user.mention} shot themselves!`, message.id);
          break;
        }

        await responder.edit(`> **CLICK!** ${user.tag} didn't shoot themselves today!`, message.id);
        continue;
      }

      round++;
      russianGame.startRound();
    });

    russianGame.startGame();
  };
}
