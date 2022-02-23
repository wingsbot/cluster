export interface TimedEvent {
  id?: number;
  time: number;
  type: string;
  guildId?: string;
  userId?: string;
}

export interface EventItem {
  id?: number;
  eventId: number;
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
  timeBought?: number;
  timeUsed?: number;
}

