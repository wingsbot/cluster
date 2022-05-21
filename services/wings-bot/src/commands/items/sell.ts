import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Sell extends CommandBase {
  public description = 'Sell an item from your inventory!';

  public options: ApplicationCommandOptions[] = [{
    name: 'item',
    description: 'Sell an item in your inventory',
    type: Constants.ApplicationCommandOptionTypes.STRING,
    autocomplete: true,
    required: true,
  }];

  public exec = async ({ interaction, responder, options }: CommandData) => {
    const itemId = options[0].value as string;
    const userInventory = await this.client.modules.economy.getUserInventory(interaction.member.id);
    let totalWingGain = 0;
    let responseMessage: string;

    if (itemId === 'allItems') {
      const allItemsFiltered = userInventory.filter(item => item.itemId !== 'easyfishingrod' && item.canBeSold);

      if (allItemsFiltered.length === 0) {
        responder.error('You don\'t have any items in your inventory.', true);
        return;
      }

      for (const item of allItemsFiltered) {
        totalWingGain += Number(item.price);
      }

      responseMessage = `Successfully sold \`${allItemsFiltered.length.toLocaleString()} Items\` for **${this.client.modules.economy.parseInt(totalWingGain)}**`;

      await this.client.modules.economy.removeInventoryItems(interaction.member.id, ['easyfishingrod']);
    } else {
      const existingItem = await this.client.modules.economy.getInventoryItem(interaction.member.id, itemId);

      if (!existingItem) {
        responder.error('The item you specified was not found.', true);
        return;
      }

      if (!existingItem.canBeSold) {
        responder.error('This item can\'t be sold.');
        return;
      }

      totalWingGain += Number(existingItem.price);
      responseMessage = `Successfully sold \`x${existingItem.quantity.toLocaleString()} ${existingItem.name}\` for **${this.client.modules.economy.parseInt(totalWingGain)}**`;

      await this.client.modules.economy.removeInventoryItem(interaction.member.id, existingItem);
    }

    responder.success(responseMessage);
  };
}
