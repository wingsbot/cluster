import { ComponentInteraction, Constants } from 'eris';
import { CommandBase, CommandData, InteractionTimeoutError, AwaitComponentReturn } from '../../lib/framework';
import { MessageComponent } from '../../lib/framework/utils';

export default class Snacks extends CommandBase {
  public description = 'Runnin low? I\'ll hook you up!';
  public cooldown = 1000 * 60;

  private readonly snacks = [
    { name: 'Doritos', emoji: '<:chips:775545724846866462>' },
    { name: 'Fritos', emoji: '<:chips:775545724846866462>' },
    { name: 'Takis', emoji: '<:chips:775545724846866462>' },
    { name: 'Ruffles', emoji: '<:chips:775545724846866462>' },
    { name: 'Lays', emoji: '<:chips:775545724846866462>' },
    { name: 'Pringles', emoji: '<:chips:775545724846866462>' },
    { name: 'Funyuns', emoji: '🧅' },
    { name: 'Cheetos', emoji: '🔥' },
    { name: 'Kitkats', emoji: '🍫' },
    { name: 'Popcorn', emoji: '🍿' },
    { name: 'Pizza Rolls', emoji: '🍕' },
    { name: 'Nutella', emoji: '🍫' },
    { name: 'Cheezits', emoji: '🧀' },
    { name: 'Skittles', emoji: '🍬' },
    { name: 'Snickers', emoji: '🍫' },
    { name: 'Chex Mix', emoji: '🍟' },
    { name: 'Air Heads', emoji: '🍭' },
    { name: 'Fruit Snacks', emoji: '🍎' },
    { name: 'Oreos', emoji: '🍪' },
    { name: 'Goldfish', emoji: '🐠' },
    { name: 'M&Ms', emoji: '🍬' },
    { name: 'Wings Chocolate Bar', emoji: '🍫' },
    { name: 'Wings Special Bag', emoji: '🍖' },
  ];

  public exec = async ({ cooldown, interaction, responder }: CommandData) => {
    const snacks = this.snacks.sort(() => Math.random() - 0.5).slice(0, 5);
    const id = this.client.util.generateId();

    const componentBase = new MessageComponent()
      .addActionRow();

    for (const snack of snacks) {
      componentBase.addButton({
        label: snack.name,
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `${snack.name}:${id}`,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      });
    }

    await responder.sendRaw({
      content: `__Choose one snack 😋:__\n${snacks.map(s => `${s.emoji} ${s.name}`).join('\n')}`,
      components: componentBase.components,
    });

    let response: ComponentInteraction & AwaitComponentReturn;
    try {
      response = await this.client.util.awaitComponent(interaction, responder, id, { strict: true });
    } catch (error) {
      if (error instanceof InteractionTimeoutError) {
        responder.edit('You\'ve ran out of time.');
      }

      cooldown.setCooldown();
      return;
    }

    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);
    switch (response.parsedId) {
      case 'Doritos':
      case 'Fritos':
      case 'Takis':
      case 'Cheetos':
      case 'Ruffles':
      case 'Lays':
      case 'Funyuns':
      case 'Pringles':
      case 'Popcorn':
      case 'Fruit Snacks':
      case 'Goldfish':
      case 'M&Ms':
      case 'Pizza Rolls': {
        const randomInt = this.client.util.getRandomInt(50, 100) * multiplier;
        await this.client.modules.economy.editBalance(interaction.member.id, randomInt);

        response.responder.editRaw({
          content: `You opened a bag of ${response.parsedId} and found **${this.client.modules.economy.parseInt(randomInt)}** in them.`,
          components: [],
        });

        break;
      }

      case 'Nutella':
      case 'Cheezits':
      case 'Skittles':
      case 'Snickers':
      case 'Chex Mix':
      case 'Air Heads':
      case 'Oreos':
      case 'Kitkats': {
        const randomInt = this.client.util.getRandomInt(50, 100) * multiplier;
        await this.client.modules.economy.editBalance(interaction.member.id, randomInt);

        response.responder.editRaw({
          content: `You opened up some ${response.parsedId} and found **${this.client.modules.economy.parseInt(randomInt)}** in them.`,
          components: [],
        });

        break;
      }

      case 'Wings Chocolate Bar': {
        const randomInt = this.client.util.getRandomInt(100, 200) * multiplier;
        await this.client.modules.economy.editBalance(interaction.member.id, randomInt);

        response.responder.editRaw({
          content: `You opened up ${response.parsedId} and found **${this.client.modules.economy.parseInt(randomInt)}** in them.`,
          components: [],
        });

        break;
      }

      case 'Wings Special Bag': {
        const randomInt = this.client.util.getRandomInt(200, 500) * multiplier;
        await this.client.modules.economy.editBalance(interaction.member.id, randomInt);

        response.responder.editRaw({
          content: `You opened up ${response.parsedId} and found **${this.client.modules.economy.parseInt(randomInt)}** in them.`,
          components: [],
        });

        break;
      }

      default: {
        break;
      }
    }

    cooldown.setCooldown();
  };
}
