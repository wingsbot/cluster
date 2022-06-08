import { ComponentInteraction, Constants, InteractionButton } from 'eris';
import { CommandBase, CommandData, InteractionTimeoutError, AwaitComponentReturn } from '../../lib/framework';
import { MessageComponent } from '../../lib/framework/utils';

export default class Bucket extends CommandBase {
  description = 'Choose a bucket, get some Wings.';
  cooldown = 1000 * 60 * 60;

  exec = async ({ cooldown, interaction, responder }: CommandData) => {
    const id = this.client.util.generateId();
    const componentBase = new MessageComponent()
      .addActionRow()
      .addButton({
        label: 'Bucket 1',
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `Bucket-1:${id}`,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      })
      .addButton({
        label: 'Bucket 2',
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `Bucket-2:${id}`,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      })
      .addButton({
        label: 'Bucket 3',
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `Bucket-3:${id}`,
        style: Constants.ButtonStyles.SECONDARY,
        disabled: false,
      });

    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);
    const embed = {
      title: 'Choose one of three buckets.',
      description: `(One of them could have ${this.client.modules.economy.parseInt(1000 * multiplier)}!)`,
      image: {
        url: 'https://i.imgur.com/elpCnYr.png',
      },
      color: responder.colors.default,
      footer: {
        text: interaction.member.tag,
      },
      timestamp: new Date().toISOString(),
    };

    await responder.sendRaw({ embeds: [embed], components: componentBase.components });

    let response: ComponentInteraction & AwaitComponentReturn;
    try {
      response = await this.client.util.awaitComponent(interaction, responder, id, { strict: true });
    } catch (error) {
      if (error instanceof InteractionTimeoutError) {
        responder.editRaw({
          embeds: [{
            description: 'You\'ve ran out of time.',
          }],
          components: [],
        });
      }

      cooldown.setCooldown();
      return;
    }

    const randomWinner = this.client.util.getRandomInt(1, 3);
    const userNumber = Number(response.parsedId.split('-')[1]);
    const buttons = componentBase.components[0].components as InteractionButton[];

    for (const c of buttons) {
      const customIdNumber = Number(c.custom_id.split(':')[0].split('-')[1]);

      c.disabled = true;

      if (customIdNumber === randomWinner) c.style = Constants.ButtonStyles.SUCCESS;
      if ((customIdNumber === userNumber) && userNumber !== randomWinner) c.style = Constants.ButtonStyles.DANGER;
    }

    if (Number(response.parsedId.split('-')[1]) === randomWinner) {
      await this.client.modules.economy.editBalance(interaction.member.id, 1000 * multiplier);

      embed.image = undefined;
      embed.description = `You search \`${response.parsedId.replace(/-/g, ' ')}\`... You found **${this.client.modules.economy.parseInt(1000 * multiplier)}**!`;

      response.responder.editRaw({ embeds: [embed], components: componentBase.components });
    } else {
      const randomAmount = this.client.util.getRandomInt(300, 500) * multiplier;
      await this.client.modules.economy.editBalance(interaction.member.id, randomAmount);

      embed.image = undefined;
      embed.description = `You search \`${response.parsedId.replace(/-/g, ' ')}\`... You found **${this.client.modules.economy.parseInt(randomAmount)}**!`;

      response.responder.editRaw({ embeds: [embed], components: componentBase.components });
    }

    cooldown.setCooldown();
  };
}
