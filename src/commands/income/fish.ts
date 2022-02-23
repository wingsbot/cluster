import { TextChannel } from 'eris';
import { CommandBase, CommandData } from '../../lib/framework';
import { Item } from '../../lib/interfaces/Shop';

export default class Fish extends CommandBase {
  public description = 'Go fishin for Wings!';
  public cooldown = 1000 * 60;

  private readonly fishingItems = {
    trashItems: ['🗞', '🥥', '👙', '🧦', '👽', '👟', '🤖', '⚰️'],
    commonItems: ['🐟', '🦆', '🦐', '🍖', '🦀', '🦑', '🦞', '💼', '🐌', '🐊', '💣', '🐠'],
    rareItems: ['🐡', '🦈', '🐙', '🐬', '🐋', '🦭'],
  };

  private itemRarity() {
    const randomNumber = Math.random();

    if (randomNumber <= 0.7) return { display: 'Common', value: 0 };
    if (randomNumber <= 0.9) return { display: 'Uncommon', value: 50 };
    if (randomNumber <= 0.992) return { display: 'Rare', value: 250 };

    return { display: 'Ultra Rare', value: 500 };
  }

  private fishing() {
    const rarity = this.itemRarity();
    const randomNumber = Math.random();

    const item: Item = {
      itemId: 'fish',
      name: '',
      userId: '',
      description: '',
      price: 0,
      count: 1,
      canBeSold: true,
      priceStack: true,
      useable: false,
      replyMessage: '',
    };

    if (randomNumber <= 0.5) {
      const trashItem = this.fishingItems.trashItems[Math.floor(Math.random() * this.fishingItems.trashItems.length)];
      const price = this.client.util.getRandomInt(5, 20);

      switch (trashItem) {
        case '🗞': {
          item.name = '🗞 Newspaper';
          item.itemId = 'newspaper';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught **Newspaper** 🗞\n> *The trash has been added to your inventory.*' };
        }

        case '🥥': {
          item.name = '🥥 Coconut';
          item.itemId = 'coconut';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught a **Coconut** 🥥\n> *The trash has been added to your inventory.*' };
        }

        case '👙': {
          item.name = '👙 {member}';
          item.itemId = '{member}-bikini';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught **{member}\'s** 👙\n> *The trash has been added to your inventory.*' };
        }

        case '🧦': {
          item.name = '🧦 {member}';
          item.itemId = '{member}-sock';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught **{member}\'s** 🧦\n> *The trash has been added to your inventory.*' };
        }

        case '👽': {
          item.name = '👽 Alien';
          item.itemId = 'alien';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught a **Alien** 👽\n> *The trash has been added to your inventory.*' };
        }

        case '👟': {
          item.name = '👟 {member}';
          item.itemId = '{member}-shoe';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught **{member}\'s** 👟\n> *The trash has been added to your inventory.*' };
        }

        case '🤖': {
          item.name = '🤖 Robot';
          item.itemId = 'robot';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught a **Robot** 🤖\n> *The trash has been added to your inventory.*' };
        }

        case '⚰️': {
          item.name = '⚰️ Coffin';
          item.itemId = 'coffin';
          item.description = 'Some trash you found in the ocean.';
          item.price = price;

          return { item, message: 'You casted out a line... You caught a **Coffin** ⚰️\n> *The trash has been added to your inventory.*' };
        }

        default: return { item: null, message: 'Something broke.' };
      }
    }

    if (randomNumber <= 0.89) {
      const commonItem = this.fishingItems.commonItems[Math.floor(Math.random() * this.fishingItems.commonItems.length)];
      const price = this.client.util.getRandomInt(100 + rarity.value, 250 + rarity.value);

      switch (commonItem) {
        case '🐟': {
          item.name = '🐟 Fish';
          item.itemId = 'fish';
          item.description = 'Just a plain ol fish.';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Fish** 🐟\n> *This item was added to your inventory.*` };
        }

        case '🦆': {
          item.name = '🦆 Ducky';
          item.itemId = 'ducky';
          item.description = 'Just a lil ducky :)';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Duck** 🦆\n> *This item was added to your inventory.*` };
        }

        case '🍖': {
          item.name = '🍖 Wings';
          item.itemId = 'wings';
          item.description = 'Just some yummy wings.';
          item.price = price;

          return { item, message: `You casted out a line... You caught **${rarity.display} Wings** 🍖\n> *This item was added to your inventory.*` };
        }

        case '🦐': {
          item.name = '🦐 Shrimp';
          item.itemId = 'shrimp';
          item.description = 'Just a cute little shrimp.';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Shrimp** 🦐\n> *This item was added to your inventory.*` };
        }

        case '🦀': {
          item.name = '🦀 Crab';
          item.itemId = 'crab';
          item.description = 'Just a cute little crab.';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Crab** 🦀\n> *This item was added to your inventory.*` };
        }

        case '🦑': {
          item.name = '🦑 Squid';
          item.itemId = 'squid';
          item.description = 'Aw a cute squid.';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Squid** 🦑\n> *This item was added to your inventory.*` };
        }

        case '🦞': {
          item.name = '🦞 Lobster';
          item.itemId = 'lobster';
          item.description = 'Just livin\' like larry.';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Lobster** 🦞\n> *This item was added to your inventory.*` };
        }

        case '💼': {
          const bagPrice = this.client.util.getRandomInt(100 + rarity.value, 500 + rarity.value);

          item.name = '💼 Briefcase';
          item.itemId = 'briefcase';
          item.description = 'Wonder whats in it 🤔.';
          item.price = bagPrice;

          return { item, message: 'You casted out a line... You caught a **Briefcase** 💼\n> *This item was added to your inventory.*' };
        }

        case '🐌': {
          item.name = '🐌 Snail';
          item.itemId = 'snail';
          item.description = 'Just a nice little snail. :)';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Snail** 🐌\n> *This item was added to your inventory.*` };
        }

        case '🐊': {
          item.name = '🐊 Crocodile';
          item.itemId = 'crocodile';
          item.description = 'This crocodile is a little scary...';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Crocodile** 🐊\n> *This item was added to your inventory.*` };
        }

        case '💣': {
          item.name = '💣 Bomb';
          item.itemId = 'bomb';
          item.description = 'This guy is gonna take ur wings lol';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **FUCKING BOMB** 💣\n> *It explodes and you lose ${this.client.modules.economy.parseInt(price)}.*` };
        }

        case '🐠': {
          item.name = '🐠 Tropical Fish';
          item.itemId = 'tropicalfish';
          item.description = 'Woah this is a cool tropical fish :o';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Tropical Fish** 🐠\n> *This item was added to your inventory.*` };
        }

        default: return { item: null, message: 'Something broke.' };
      }
    }

    if (randomNumber <= 0.995) {
      const rareItem = this.fishingItems.rareItems[Math.floor(Math.random() * this.fishingItems.rareItems.length)];
      const price = this.client.util.getRandomInt(500 + rarity.value, 750 + rarity.value);

      switch (rareItem) {
        case '🐡': {
          item.name = '🐡 Puffer Fish';
          item.itemId = 'pufferfish';
          item.description = 'Aw a cute puffer fish :)';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Puffer Fish** 🐡\n> *This item was added to your inventory.*` };
        }

        case '🦈': {
          item.name = '🦈 Shark';
          item.itemId = 'shark';
          item.description = 'WO-woah wait.. how did you catch a shark?';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Shark** 🦈\n> *This item was added to your inventory.*` };
        }

        case '🐙': {
          item.name = '🐙 Octopus';
          item.itemId = 'octopus';
          item.description = 'Cute huge octopus :)';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Octopus** 🐙\n> *This item was added to your inventory.*` };
        }

        case '🐬': {
          item.name = '🐬 Dolphin';
          item.itemId = 'dolphin';
          item.description = 'Dolphins be like *dolphin noises*';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Dolphin** 🐬\n> *This item was added to your inventory.*` };
        }

        case '🐋': {
          item.name = '🐋 Whale';
          item.itemId = 'whale';
          item.description = 'If I could name this fella.. I\'d name him Shamou.';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Whale** 🐋\n> *This item was added to your inventory.*` };
        }

        case '🦭': {
          item.name = '🦭 Seal';
          item.itemId = 'seal';
          item.description = 'Wow uh how did you pull this up?';
          item.price = price;

          return { item, message: `You casted out a line... You caught a **${rarity.display} Seal** 🦭\n> *This item was added to your inventory but wtf lol.*` };
        }

        default: return { item: null, message: 'Something broke.' };
      }
    }

    const cost = this.client.util.getRandomInt(2000, 5000);

    item.name = '💎 Diamond';
    item.itemId = 'diamond';
    item.description = 'This is a very rare item 😳';
    item.price = cost;

    return { item, message: 'You casted out a line... You caught a **Diamond** 💎\n> *This item was added to your inventory.*' };
  }

  public exec = async ({ cooldown, interaction, responder }: CommandData) => {
    const userFishingRod = await this.client.modules.economy.getInventoryItem(interaction.member.id, 'easyfishingrod');

    if (!userFishingRod) {
      responder.error('You must buy a fishing rod! Do `/buy fishing rod`', true);
      return;
    }

    userFishingRod.durability--;
    userFishingRod.price = Math.floor(userFishingRod.price * (userFishingRod.durability / userFishingRod.maxDurability));

    const postFishing = this.fishing();

    if (userFishingRod.durability < 1) {
      await this.client.modules.economy.removeInventoryItem(interaction.member.id, userFishingRod);

      postFishing.message += '\n\nYour fishing rod broke! Buy a new one by doing `/buy fishing rod`';
    } else {
      await this.client.modules.economy.updateInventoryItem(interaction.member.id, userFishingRod);
    }

    postFishing.item.userId = interaction.member.id;

    if (interaction.guildID) {
      const channel = interaction.channel as TextChannel;
      postFishing.item.name.replace(/{member}/g, channel.guild.members.random().tag);
      postFishing.item.itemId.replace(/{member}/g, channel.guild.members.random().tag);
    } else {
      postFishing.item.name.replace(/{member}/g, interaction.member.tag);
      postFishing.item.itemId.replace(/{member}/g, interaction.member.tag);
    }

    if (postFishing.item.itemId === 'bomb') {
      await this.client.modules.economy.editBalance(interaction.member.id, postFishing.item.price);
      responder.send(postFishing.message);

      cooldown.setCooldown();
      return;
    }

    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);
    postFishing.item.price *= multiplier;

    const existingItem = await this.client.modules.economy.getInventoryItem(interaction.member.id, postFishing.item.itemId);
    if (existingItem) existingItem.price += postFishing.item.price;

    await this.client.modules.economy.addInventoryItem(interaction.member.id, existingItem || postFishing.item);
    responder.send(postFishing.message);

    cooldown.setCooldown();
  };
}
