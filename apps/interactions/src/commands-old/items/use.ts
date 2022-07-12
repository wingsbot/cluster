import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Use extends CommandBase {
  description = 'Use an item in your inventory.';

  options: ApplicationCommandOptions[] = [{
    name: 'item',
    description: 'Use an item in your inventory',
    type: Constants.ApplicationCommandOptionTypes.STRING,
    autocomplete: true,
    required: true,
  }];

  exec = async ({ interaction, responder, options }: CommandData) => {
    const itemId = options[0].value as string;
    const existingItem = await this.client.modules.economy.getInventoryItem(interaction.member.id, itemId);

    if (!existingItem) {
      responder.error('The item you specified was not found.', true);
      return;
    }

    if (!existingItem.useable) {
      responder.error('The item you specified is not allowed to be used.', true);
      return;
    }

    if (existingItem.powerUp) {
      await this.client.modules.economy.removeInventoryItem(interaction.member.id, existingItem);
      await this.client.modules.economy.setActiveItem(interaction.member.id, interaction.guildID, existingItem);
    }

    responder.send(existingItem.replyMessage);
  };
}
