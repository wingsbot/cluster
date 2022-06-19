import { PrismaClient } from '@prisma/client';
import { ActiveItemsDatabase, EventsDatabase, InventoryDatabase, ShopDatabase, UserDatabase } from './models';

export class Database {
  client: PrismaClient;
  activeItems: ActiveItemsDatabase;
  events: EventsDatabase;
  inventory: InventoryDatabase;
  shop: ShopDatabase;
  user: UserDatabase;

  constructor() {
    this.client = new PrismaClient();
    this.activeItems = new ActiveItemsDatabase(this.client, this.client.activeItem);
    this.events = new EventsDatabase(this.client, this.client.events);
    this.inventory = new InventoryDatabase(this.client, this.client.inventory);
    this.shop = new ShopDatabase(this.client, this.client.shop);
    this.user = new UserDatabase(this.client, this.client.user);
  }
}
