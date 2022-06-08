import { Client } from '..';
import { ModuleBase } from '../lib/framework';
import { Item, shopItems } from '../lib/economy';

export class Shop extends ModuleBase {
  private readonly defaultItems = shopItems;
  private readonly shopCache: Map<string, Item> = new Map();

  constructor(client: Client) {
    super(client);

    this.init();
  }


  // special items through db, default items are default, Object.assign()
  private async init() {
    const specialItems = await this.client.db.shop.getAllItems();
    if (specialItems.length === 0) return;

    for (const item of specialItems) {
      this.shopCache.set(item.itemId, new Item(item));
    }
  }

  getShopItems(): Item[] {
    return [...Object.values(this.shopCache), ...this.defaultItems];
  }

  getShopItem(itemId: string | number) {
    const shopItems = this.getShopItems();

    return shopItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  // special limited time items
  async addSpecialItem(item: Item) {
    if (this.shopCache.has(item.itemId) || this.defaultItems.some(index => index.itemId === item.itemId)) return;
    const newItem = await this.client.db.shop.addItem(item.databaseItem());

    this.shopCache.set(item.itemId, new Item(newItem));
  }

  async removeSpecialItem(item: Item) {
    if (!this.shopCache.has(item.itemId)) return;

    this.shopCache.delete(item.itemId);
    await this.client.db.shop.deleteItem(item.id);
  }
}
