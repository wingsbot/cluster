import { Item } from './structures/Item';

export const upgradeBank = new Item({
  name: '🏦 Upgrade Bank',
  itemId: 'upgradebank',
  description: 'This item upgrades your bank limit.',
  quantity: 1,
  price: 0,
  maxInInv: 1,
  useable: false,
  canBeSold: false,
  replyMessage: 'Upgraded your bank limit to **{amount}**',
});

export const easyFishingRod = new Item({
  name: '🎣 Easy Fishing Rod',
  itemId: 'easyfishingrod',
  description: 'You use this item for the fish command.',
  quantity: 1,
  price: 500,
  maxInInv: 1,
  useable: false,
  canBeSold: true,
  replyMessage: 'You can\'t use this item. Just run the `/fish` command.',
});

export const x2Wings = new Item({
  name: '<a:wingscoinspin:854559360235077653> x2 Wings',
  itemId: 'x2wings',
  description:' You get a 10 minute multiplier! (only works on income commands + hilo & slots)',
  quantity: 1,
  price: 10_000,
  powerUp: true,
  usageTime: 600_000,
  canBeSold: true,
  useable: true,
  replyMessage: 'Successfully activated. You have 10 minutes!',
});

export const robberStopper = new Item({
  name: '🛡️ Robber Stopper',
  itemId: 'robberstopper',
  description: 'You get a 24 hours of protection from being robbed! (disappears after successfully protecting you once)',
  quantity: 1,
  price: 5000,
  powerUp: true,
  usageTime: 86_400_000,
  canBeSold: true,
  useable: true,
  replyMessage: 'Successfully activated. Robber Stopper protects you for 24 hours. It will be removed if it successfully protects you once or time runs out.',
});
