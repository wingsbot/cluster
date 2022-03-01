export interface Item {
  id?: number;
  itemId: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerUp?: boolean;
  cooldownBetweenPurchase?: number;
  priceStack?: boolean;
  durability?: number;
  maxDurability?: number;
  maxInInv?: number;
  stock?: number;
  usageTime?: number;
  timeBought?: Date;
  timeUsed?: Date;
}

export interface ActiveItem {
  id?: number;
  itemId: string;
  userId: string;
  guildId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerUp?: boolean;
  cooldownBetweenPurchase?: number;
  priceStack?: boolean;
  durability?: number;
  maxDurability?: number;
  maxInInv?: number;
  stock?: number;
  usageTime?: number;
  timeBought?: Date;
  timeUsed?: Date;
}

export interface SpecialItem {
  id?: number;
  itemId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerup?: boolean;
  cooldownBetweenPurchase?: number;
  priceStack?: boolean;
  durability?: number;
  maxDurability?: number;
  maxInInv?: number;
  stock?: number;
  usageTime?: number;
  timeBought?: Date;
  timeUsed?: Date;
}
