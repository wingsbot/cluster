import { Constants, InteractionButton } from 'eris';
import type { Shop as ShopItem } from '@prisma/client';
import { CommandBase, CommandData, ComponentData } from '../../lib/framework';
import { MessageComponent } from '../../lib/framework/utils';

export default class Shop extends CommandBase {
  public description = 'Fishing Rods, Pickaxes, Robber Stopper, and more!';

  public exec = async ({ interaction, responder }: CommandData) => {
    const componentBase = new MessageComponent()
      .addActionRow()
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `shop-left:1:${interaction.member.id}`,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: {
          name: 'left',
          id: '865821255684456468',
        },
        disabled: false,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `shop-right:1:${interaction.member.id}`,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: {
          name: 'right',
          id: '865821583556608081',
        },
        disabled: false,
      });

    const userData = await this.client.modules.economy.getUserData(interaction.member.id);
    const shopItems = this.client.modules.shop.getShopItems();
    const thisPage = shopItems.slice(0, 5);

    responder.sendRaw({
      embeds: [{
        title: 'Wings Shop',
        color: responder.colors.default,
        thumbnail: {
          url: 'https://cdn.discordapp.com/emojis/772702907468480532.png?v=1',
        },
        description: thisPage.map((item: ShopItem) => {
          if (item.itemId === 'upgradebank') item.price = BigInt(Math.round(Number(userData.bankCap) / 3));

          return `**${item.name}** - ${this.client.modules.economy.parseInt(item.price)}\n> ${item.description}`;
        }).join('\n\n'),
        timestamp: new Date().toISOString(),
        footer: {
          text: `Page 1/${Math.ceil(shopItems.length / 5)}`,
        },
      }],
      components: componentBase.components,
    });
  };

  public componentExec = async ({ interaction, data, responder }: ComponentData) => {
    const [actionName, pageId, userId] = data.custom_id.split(':');

    if (!userId || interaction.member.id !== userId) {
      responder.error('You aren\'t the owner of this prompt.', true);
      return;
    }

    const userData = await this.client.modules.economy.getUserData(userId);
    const shopItems = this.client.modules.shop.getShopItems();

    const componentBase = new MessageComponent(JSON.parse(JSON.stringify(interaction.message.components)));
    const buttons = componentBase.components[0].components as InteractionButton[];

    let page = Number(pageId);
    let thisPage = shopItems.slice((page - 1) * 5, (page) * 5);

    for (const c of buttons) {
      const parsedId = c.custom_id.split(':');
      c.custom_id = `${parsedId[0]}:${page.toString()}:${parsedId[2]}`;
    }

    if (actionName === 'shop-right') {
      page++;
      if (page > Math.ceil(shopItems.length / 5)) page = 1;
    } else {
      page--;
      if (page < Math.ceil(shopItems.length / 5)) page = Math.ceil(shopItems.length / 5);
    }

    thisPage = shopItems.slice((page - 1) * 5, (page) * 5);

    responder.editRaw({
      embeds: [{
        title: 'Wings Shop',
        color: responder.colors.default,
        thumbnail: {
          url: 'https://cdn.discordapp.com/emojis/772702907468480532.png?v=1',
        },
        description: thisPage.map((item: ShopItem) => {
          if (item.itemId === 'upgradebank') item.price = BigInt(Math.round(Number(userData.bankCap) / 3));

          return `**${item.name}** - ${this.client.modules.economy.parseInt(item.price)}\n> ${item.description}`;
        }).join('\n\n'),
        timestamp: new Date().toISOString(),
        footer: {
          text: `Page ${page}/${Math.ceil(shopItems.length / 5)}`,
        },
      }],
      components: componentBase.components,
    });
  };
}
