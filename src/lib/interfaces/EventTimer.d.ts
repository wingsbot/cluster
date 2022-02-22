import type { ObjectId } from 'bson';
import type { ActiveItem, Item } from './Shop.d';

export interface TimerData {
  _id?: ObjectId;
  time: number;
  type: string;
  data: ItemExpire | ShopItemExpire;
}

export interface ItemExpire {
  guildId: string;
  userId: string;
  item: ActiveItem;
}

export interface ShopItemExpire {
  guildId?: string;
  item: Item;
}
