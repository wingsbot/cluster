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
      this.shopCache.set(item.itemId, item);
    }
  }

  public getShopItems(): Item[] {
    return [...Object.values(this.shopCache), ...this.defaultItems] as Item[];
  }

  public getShopItem(itemId: string) {
    const shopItems = this.getShopItems();

    for (let i = 0; i < this.getShopItems().length; i++) {
      shopItems[i] = this.getShopItems()[i];
    }

    return shopItems.find(item => item.itemId === itemId);
  }

  // special limited time items
  public async addSpecialItem(item: Item) {
    if (this.shopCache.has(item.itemId) || this.defaultItems.find(i => i.itemId === item.itemId)) return;
    const newItem = await this.client.grpc.shop.addSpecialItem(item);

    this.shopCache.set(item.itemId, newItem);
  }

  public async removeSpecialItem(item: Item) {
    if (!this.shopCache.has(item.itemId)) return;

    this.shopCache.delete(item.itemId);
    await this.client.grpc.shop.removeSpecialItem(item);
  }
}
