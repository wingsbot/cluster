import { ModuleBase } from '../lib/framework';
import type { Item, SpecialItem } from '../lib/interfaces/Shop';
import { shopItems } from '../lib/core';
import type { Shard } from '../Shard';

export class Shop extends ModuleBase {
  private readonly defaultItems: Item[] = shopItems;
  private readonly shopCache: Map<string, SpecialItem> = new Map();

  constructor(client: Shard) {
    super(client);

    this.init();
  }

  get canLoadShop() {
    return this.client.firstShardId === 0;
  }

  // special items through db, default items are default, Object.assign()
  private async init() {
    if (!this.canLoadShop) return;
    const specialItems = await this.client.grpc.shop.getSpecialItems();

    if (specialItems.length === 0) return;
    for (const item of specialItems) {
      const parsedItem = Object.assign(item, {
        price: Number(item.price),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: Number(item.cooldownBetweenPurchase) }),
        ...(item.usageTime && { usageTime: Number(item.usageTime) }),
      });

      this.shopCache.set(item.itemId, parsedItem);
    }
  }

  public getShopItems(): Item[] {
    return [...Object.values(this.shopCache), ...this.defaultItems] as Item[];
  }

  public getShopItem(itemId: string | number) {
    const shopItems = this.getShopItems();

    return shopItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  // special limited time items
  public async addSpecialItem(item: Item) {
    if (this.shopCache.has(item.itemId) || this.defaultItems.find(i => i.itemId === item.itemId)) return;
    const parsedItem = Object.assign(item, {
      price: item.price.toString(),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
      ...(item.usageTime && { usageTime: item.usageTime.toString() }),
    });

    const newGrpcItem = await this.client.grpc.shop.addSpecialItem(parsedItem);
    const newItem = Object.assign(newGrpcItem, {
      price: Number(item.price),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: Number(item.cooldownBetweenPurchase) }),
      ...(item.usageTime && { usageTime: Number(item.usageTime) }),
    });

    this.shopCache.set(item.itemId, newItem);
  }

  public async removeSpecialItem(item: Item) {
    if (!this.shopCache.has(item.itemId)) return;

    this.shopCache.delete(item.itemId);

    const parsedItem = Object.assign(item, {
      price: item.price.toString(),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
      ...(item.usageTime && { usageTime: item.usageTime.toString() }),
    });

    await this.client.grpc.shop.removeSpecialItem(parsedItem);
  }
}
