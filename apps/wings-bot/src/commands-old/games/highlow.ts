import { ComponentInteraction, Constants, InteractionButton } from 'eris';
import { CommandBase, CommandData, InteractionTimeoutError, AwaitComponentReturn } from '../../lib/framework';
import { MessageComponent } from '../../lib/framework/utils';

export default class HighLow extends CommandBase {
  description = 'Guess if the next number is higher or lower.';
  cooldown = 1000 * 30;

  exec = async ({ cooldown, interaction, responder }: CommandData) => {
    const id = this.client.util.generateId();
    const componentBase = new MessageComponent()
      .addActionRow()
      .addButton({
        label: 'Higher',
        custom_id: `higher:${id}`,
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      })
      .addButton({
        label: 'Tie',
        custom_id: `tie:${id}`,
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      })
      .addButton({
        label: 'Lower',
        custom_id: `lower:${id}`,
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      });

    const initRandomNumber = this.client.util.getRandomInt(1, 100);

    const embed = {
      author: {
        name: interaction.member.tag,
        icon_url: interaction.member.avatarURL,
      },
      title: `The first number selected was ${initRandomNumber.toLocaleString()}`,
      color: undefined,
      description: `If you select \`Tie\` and win, you could win **${this.client.modules.economy.parseInt(5000)}**!\n> Will the next number be **Higher** or **Lower**?`,
      footer: {
        text: 'Randomly selects a number between 1-100',
      },
    };

    await responder.sendRaw({ embeds: [embed], components: componentBase.components });

    let response: ComponentInteraction & AwaitComponentReturn;

    try {
      response = await this.client.util.awaitComponent(interaction, responder, id, { strict: true });
    } catch (error) {
      if (error instanceof InteractionTimeoutError) {
        responder.editRaw('You ran out of time to answer!');
      }

      cooldown.setCooldown();
      return;
    }

    const winningNumber = this.client.util.getRandomInt(1, 100);
    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);
    const buttons = componentBase.components[0].components as InteractionButton[];

    if (response.parsedId === 'higher') {
      if (winningNumber > initRandomNumber) {
        const winningAmount = 100 * multiplier;

        buttons.find(c => c.custom_id.split(':')[0] === response.parsedId).style = Constants.ButtonStyles.SUCCESS;
        await this.client.modules.economy.editBalance(interaction.member.id, winningAmount);

        embed.color = responder.colors.green;
        embed.description = `The new number selected was **${winningNumber.toLocaleString()}**. You won **${this.client.modules.economy.parseInt(winningAmount)}**`;
      } else {
        for (const c of buttons) {
          if (c.custom_id.split(':')[0] === response.parsedId) c.style = Constants.ButtonStyles.DANGER;
          if (winningNumber === initRandomNumber && c.custom_id.split(':')[0] === 'tie') c.style = Constants.ButtonStyles.SUCCESS;
          if (winningNumber < initRandomNumber && c.custom_id.split(':')[0] === 'lower') c.style = Constants.ButtonStyles.SUCCESS;
        }

        embed.color = responder.colors.red;
        embed.description = `The new number selected was **${winningNumber.toLocaleString()}**. You lost.`;
      }
    }

    if (response.parsedId === 'tie') {
      if (winningNumber === initRandomNumber) {
        const winningAmount = 5000 * multiplier;

        buttons.find(c => c.custom_id.split(':')[0] === response.parsedId).style = Constants.ButtonStyles.SUCCESS;
        await this.client.modules.economy.editBalance(interaction.member.id, winningAmount);

        embed.color = responder.colors.green;
        embed.description = `The new number selected was **${winningNumber.toLocaleString()}**. You won **${this.client.modules.economy.parseInt(winningAmount)}**`;
      } else {
        for (const c of buttons) {
          if (c.custom_id.split(':')[0] === response.parsedId) c.style = Constants.ButtonStyles.DANGER;
          if (winningNumber < initRandomNumber && c.custom_id.split(':')[0] === 'lower') c.style = Constants.ButtonStyles.SUCCESS;
          if (winningNumber > initRandomNumber && c.custom_id.split(':')[0] === 'higher') c.style = Constants.ButtonStyles.SUCCESS;
        }

        embed.color = responder.colors.red;
        embed.description = `The new number selected was **${winningNumber.toLocaleString()}**. You lost.`;
      }
    }

    if (response.parsedId === 'lower') {
      if (winningNumber < initRandomNumber) {
        const winningAmount = 100 * multiplier;

        buttons.find(c => c.custom_id.split(':')[0] === response.parsedId).style = Constants.ButtonStyles.SUCCESS;
        await this.client.modules.economy.editBalance(interaction.member.id, winningAmount);

        embed.color = responder.colors.green;
        embed.description = `The new number selected was **${winningNumber.toLocaleString()}**. You won **${this.client.modules.economy.parseInt(winningAmount)}**`;
      } else {
        for (const c of buttons) {
          if (c.custom_id.split(':')[0] === response.parsedId) c.style = Constants.ButtonStyles.DANGER;
          if (winningNumber === initRandomNumber && c.custom_id.split(':')[0] === 'tie') c.style = Constants.ButtonStyles.SUCCESS;
          if (winningNumber > initRandomNumber && c.custom_id.split(':')[0] === 'higher') c.style = Constants.ButtonStyles.SUCCESS;
        }

        embed.color = responder.colors.red;
        embed.description = `The new number selected was **${winningNumber.toLocaleString()}**. You lost.`;
      }
    }

    componentBase.disableAllComponents();

    response.responder.editRaw({ embeds: [embed], components: componentBase.components });
    cooldown.setCooldown();
  };
}
