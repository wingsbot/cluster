import { ApplicationCommandOptions, Constants } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Buy extends CommandBase {
  public description = 'Buy an item from the shop!';

  public options: ApplicationCommandOptions[] = [{
    name: 'item',
    description: 'Buy an item in the shop',
    type: Constants.ApplicationCommandOptionTypes.STRING,
    autocomplete: true,
    required: true,
  }];

  public exec = async ({ interaction, responder, options }: CommandData) => {
    const itemId = options[0].value as string;
    const shopItem = this.client.modules.shop.getShopItem(itemId);

    if (!shopItem) {
      responder.error('The item you specified was not found.', true);
      return;
    }

    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    const existingItem = await this.client.modules.economy.getInventoryItem(interaction.member.id, itemId);

    if (shopItem.stock && shopItem.stock < 1) {
      responder.error('This item has ran out of stock!', true);
      return;
    }

    if (shopItem.maxInInv && existingItem && existingItem.count >= shopItem.maxInInv) {
      responder.error(`You can't have more than ${shopItem.maxInInv.toLocaleString()} **${shopItem.name}**!`, true);
      return;
    }

    if (shopItem.itemId === 'upgradebank') shopItem.price = Math.round(userData.bankCap / 3);
    if (shopItem.price > userData.balance) {
      responder.error(`You don't have enough ${this.client.modules.economy.parseInt()}'s to buy **${shopItem.name}**`, true);
      return;
    }

    await this.client.modules.economy.editBalance(interaction.member.id, -shopItem.price);

    shopItem.timeBought = new Date();
    shopItem.userId = interaction.member.id;

    if (shopItem.itemId === 'upgradebank') {
      const newBankSpace = Math.round(userData.bankCap / 4);

      await this.client.modules.economy.editBankCap(interaction.member.id, newBankSpace);
      responder.send(shopItem.replyMessage.replace(/{amount}/g, this.client.modules.economy.parseInt(userData.bankCap)));
      return;
    }

    if (shopItem.itemId === 'easyfishingrod') {
      const randomDurability = this.client.util.getRandomInt(4, 8);

      shopItem.durability = randomDurability;
      shopItem.maxDurability = randomDurability;
    }

    this.client.modules.economy.addInventoryItem(interaction.member.id, shopItem);
    responder.success(`Successfully purchased **x${shopItem.count} ${shopItem.name}**`);
  };
}
