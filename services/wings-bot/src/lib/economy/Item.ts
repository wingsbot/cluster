import { Prisma, Shop } from '@prisma/client';

export class Item {
  id: number;
  name: string;
  itemId: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  quantity: number;
  useable: boolean;
  powerUp: boolean;
  priceStack: boolean;
  cooldownBetweenPurchase?: number;
  durability?: number;
  maxDurability?: number;
  maxInInv: number;
  stock: number;
  usageTime: number;
  timeBought: Date;
  timeUsed: Date;

  constructor(item: Prisma.ShopCreateArgs['data']) {
    this.id = null;
    this.name = item.name;
    this.itemId = item.itemId;
    this.description = item.description;
    this.price = item.price as number;
    this.canBeSold = item.canBeSold;
    this.replyMessage = item.replyMessage;
    this.quantity = item.quantity as number;
    this.useable = item.useable;
    this.powerUp = item.powerUp || false;
    this.cooldownBetweenPurchase = item.cooldownBetweenPurchase as number || null;
    this.priceStack = item.priceStack || true;
    this.durability = item.durability || null;
    this.maxDurability = item.maxDurability || null;
    this.maxInInv = item.maxInInv as number || null;
    this.stock = item.stock as number || null;
    this.usageTime = item.usageTime as number || null;
    this.timeBought = null;
    this.timeUsed = null;
  }

  databaseItem(): Shop {
    return {
      id: this.id,
      name: this.name,
      itemId: this.itemId,
      description: this.description,
      price: BigInt(this.price),
      canBeSold: this.canBeSold,
      replyMessage: this.replyMessage,
      quantity: BigInt(this.quantity),
      useable: this.useable,
      powerUp: this.powerUp,
      cooldownBetweenPurchase: BigInt(this.cooldownBetweenPurchase),
      priceStack: this.priceStack,
      durability: this.durability,
      maxDurability: this.maxDurability,
      maxInInv: BigInt(this.maxInInv),
      stock: BigInt(this.stock),
      usageTime: BigInt(this.usageTime),
      timeBought: this.timeBought,
      timeUsed: this.timeUsed,
    };
  }

  setId(id: number) {
    this.id = id;
  }

  setTimeBought(time: Date) {
    this.timeBought = time;
  }

  setTimeUsed(time: Date) {
    this.timeUsed = time;
  }

  addQuantity(quantity: number) {
    this.quantity += quantity;
  }

  removeQuantity(quantity: number) {
    this.quantity -= quantity;
  }
}
