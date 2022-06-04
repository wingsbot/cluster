import { ModuleBase } from '../lib/framework';
import type { Shard } from '../Shard';

export class Shop extends ModuleBase {
  private readonly defaultItems: ShopItem[] = shopItems;
  private readonly shopCache: Map<string, ShopItem> = new Map();

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
    const specialItems = await this.client.db.shop.getAllItems();

    if (specialItems.length === 0) return;
    for (const item of specialItems) {
      this.shopCache.set(item.itemId, item);
    }
  }

  public getShopItems(): ShopItem[] {
    return [...Object.values(this.shopCache), ...this.defaultItems] as ShopItem[];
  }

  public getShopItem(itemId: string | number) {
    const shopItems = this.getShopItems();

    return shopItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  // special limited time items
  public async addSpecialItem(item: ShopItem) {
    if (this.shopCache.has(item.itemId) || this.defaultItems.find(i => i.itemId === item.itemId)) return;
    const newItem = await this.client.db.shop.addItem(item);

    this.shopCache.set(item.itemId, newItem);
  }

  public async removeSpecialItem(item: ShopItem) {
    if (!this.shopCache.has(item.itemId)) return;

    this.shopCache.delete(item.itemId);
    await this.client.db.shop.deleteItem(item.id);
  }
}
