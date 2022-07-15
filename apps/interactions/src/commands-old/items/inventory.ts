import { ComponentInteractionSelectMenuData, Constants, InteractionButton, SelectMenu, SelectMenuOptions } from 'eris';
import { Inventory as InventoryItem } from '@wings/database';
import { CommandBase, CommandData, ComponentData } from '../../lib/framework';
import { MessageComponent } from '../../lib/framework/utils';

export default class Inventory extends CommandBase {
  description = 'Check the items you have!';

  exec = async ({ interaction, responder }: CommandData) => {
    const inventory = await this.client.modules.economy.getUserInventory(interaction.member.id);

    if (inventory.length === 0) {
      responder.sendEmbed({
        author: {
          name: `${interaction.member.username}'s Inventory`,
          icon_url: interaction.member.avatarURL,
        },
        color: responder.colors.default,
        description: 'You have no items in your inventory.',
        footer: {
          text: 'Page 1/1',
        },
        timestamp: new Date().toISOString(),
      });
      return;
    }

    const componentBase = new MessageComponent()
      .addActionRow()
      .addMenu({
        type: Constants.ComponentTypes.SELECT_MENU,
        custom_id: `inventory-menu:1:${interaction.member.id}`,
        options: [{
          label: 'Newest Items',
          value: 'newestItems',
          description: 'Filters to show items new to old.',
          default: true,
        },
        {
          label: 'Oldest Items',
          value: 'oldestItems',
          description: 'Filters to show items old to new.',
          default: false,
        },
        {
          label: 'Alphabetical',
          value: 'alphabetical',
          description: 'Filters to show items in alphabetical order.',
          default: false,
        },
        {
          label: 'Most Value',
          value: 'mostValue',
          description: 'Filters to show items from most valuable to least valuable.',
          default: false,
        },
        {
          label: 'Least Value',
          value: 'leastValue',
          description: 'Filters to show items from least valuable to most valuable.',
          default: false,
        }],
        disabled: false,
      })
      .addActionRow()
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `inventory-left:1:${interaction.member.id}`,
        style: Constants.ButtonStyles.PRIMARY,
        emoji: {
          name: 'left',
          id: '865821255684456468',
        },
        disabled: false,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        custom_id: `inventory-right:1:${interaction.member.id}`,
        style: Constants.ButtonStyles.PRIMARY,
        emoji: {
          name: 'right',
          id: '865821583556608081',
        },
        disabled: false,
      });

    const thisPage = inventory.reverse().slice(0, 10);

    responder.sendRaw({
      embeds: [{
        author: {
          name: `${interaction.member.username}'s Inventory`,
          icon_url: interaction.member.avatarURL,
        },
        color: responder.colors.default,
        description: thisPage.map(item => `**${item.name}** - *x${item.quantity}*`).join('\n\n'),
        footer: {
          text: `Page 1/${Math.ceil(inventory.length / 10)}`,
        },
        timestamp: new Date().toISOString(),
      }],
      components: componentBase.components,
    });
  };

  componentExec = async ({ interaction, data, responder }: ComponentData) => {
    const [actionName, pageId, userId] = data.custom_id.split(':');

    if (!userId || interaction.member.id !== userId) {
      responder.error('You aren\'t the owner of this prompt.', true);
      return;
    }

    const inventory = await this.client.modules.economy.getUserInventory(interaction.member.id);
    const filteredArray = [...inventory];
    const componentBase = new MessageComponent(JSON.parse(JSON.stringify(interaction.message.components)));
    const selectMenu = componentBase.components[0].components as SelectMenu[];
    const buttons = componentBase.components[1].components as InteractionButton[];

    let page = Number(pageId);
    let thisPage = filteredArray.reverse().slice((page - 1) * 10, (page) * 10);

    for (const c of selectMenu) {
      const parsedId = c.custom_id.split(':');
      c.custom_id = `${parsedId[0]}:${page.toString()}:${parsedId[2]}`;
    }

    for (const c of buttons) {
      const parsedId = c.custom_id.split(':');
      c.custom_id = `${parsedId[0]}:${page.toString()}:${parsedId[2]}`;
    }

    if (actionName === 'inventory-right') {
      const defaultMenuValue = selectMenu[0].options.find(comp => comp.default);
      this.filterInventory(defaultMenuValue.value, filteredArray);

      page++;
      if (page > Math.ceil(filteredArray.length / 10)) page = 1;
    } else if (actionName === 'inventory-left') {
      const defaultMenuValue = selectMenu[0].options.find((comp: SelectMenuOptions) => comp.default);
      this.filterInventory(defaultMenuValue.value, filteredArray);

      page--;
      if (page < Math.ceil(filteredArray.length / 10)) page = Math.ceil(filteredArray.length / 10);
    } else {
      const selectMenuData = data as ComponentInteractionSelectMenuData;
      this.filterInventory(selectMenuData.values[0], filteredArray);

      for (const c of selectMenu[0].options) {
        c.default = false;
        if (c.value === selectMenuData.values[0]) c.default = true;
      }
    }

    thisPage = filteredArray.slice((page - 1) * 10, (page) * 10);

    responder.editRaw({
      embeds: [{
        author: {
          name: `${interaction.member.username}'s Inventory`,
          icon_url: interaction.member.avatarURL,
        },
        color: responder.colors.default,
        description: thisPage.map(item => `**${item.name}** - *x${item.quantity}*`).join('\n\n'),
        footer: {
          text: `Page ${page}/${Math.ceil(filteredArray.length / 10)}`,
        },
        timestamp: new Date().toISOString(),
      }],
      components: componentBase.components,
    });
  };

  private filterInventory(value: string, filteredArray: InventoryItem[]) {
    switch (value) {
    case 'oldestItems': {
      filteredArray.reverse();
      break;
    }

    case 'alphabetical': {
      filteredArray.sort((itemA, itemB) => itemA.itemId.localeCompare(itemB.itemId));
      break;
    }

    case 'mostValue': {
      filteredArray.sort((itemA, itemB) => Number(itemB.price) - Number(itemA.price));
      break;
    }

    case 'leastValue': {
      filteredArray.sort((itemA, itemB) => Number(itemA.price) - Number(itemB.price));
      break;
    }

    default: {
      break;
    }
    }
  }
}
