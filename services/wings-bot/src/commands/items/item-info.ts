import { Constants, ApplicationCommandOptions } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class ItemInfo extends CommandBase {
  description = 'Get info on an item in your inventory.';
  options: ApplicationCommandOptions[] = [{
    name: 'item',
    description: 'Select an item from your inventory.',
    type: Constants.ApplicationCommandOptionTypes.STRING,
    autocomplete: true,
    required: true,
  }];

  exec = async ({ interaction, responder, options }: CommandData) => {
    const itemId = options[0].value as string;
    const userItem = await this.client.modules.economy.getInventoryItem(interaction.member.id, itemId);

    if (!userItem) {
      responder.error('The item you specified was not found.', true);
      return;
    }

    responder.sendEmbed({
      title: `${userItem.name} (ID: ${userItem.itemId})`,
      description: userItem.description,
      fields: [{
        name: 'Price',
        value: this.client.modules.economy.parseInt(userItem.price),
        inline: true,
      },
      {
        name: 'Stock Count',
        value: userItem.stock ? userItem.stock.toLocaleString() : 'Infinite',
        inline: true,
      },
      {
        name: 'Can be sold?',
        value: userItem.canBeSold ? 'Yes' : 'No',
        inline: true,
      },
      {
        name: 'Can be used?',
        value: userItem.useable ? 'Yes' : 'No',
        inline: true,
      },
      {
        name: 'Reply Message',
        value: userItem.replyMessage ? userItem.replyMessage : 'None',
      }],
    });
  };
}
