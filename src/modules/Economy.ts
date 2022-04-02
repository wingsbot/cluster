import type { TopTenUser, UserData } from '../lib/interfaces/Economy';
import { ModuleBase } from '../lib/framework/bases/ModuleBase';
import { ActiveItem, Item } from '../lib/interfaces/Shop';

export class Economy extends ModuleBase {
  public readonly userCache: Map<string, UserData> = new Map();
  public readonly inventoryCache: Map<string, Item[]> = new Map();
  public readonly activeItemsCache: Map<string, ActiveItem[]> = new Map();

  public async getUserData(userId: string): Promise<UserData> {
    const userCache = this.userCache.get(userId);
    if (userCache) return userCache;

    const userData = await this.client.grpc.economy.getUser(userId) as UserData;
    this.userCache.set(userId, userData);

    return userData;
  }

  public parseInt(amount?: number) {
    if (!amount && amount !== 0) return '🍖';
    return `🍖${amount.toLocaleString()}`;
  }

  public async editBalance(userId: string, balance: number) {
    const userData = await this.getUserData(userId);

    userData.balance += balance;

    await this.client.grpc.economy.updateBalance(userId, balance);
  }

  public async editBank(userId: string, bank: number) {
    const userData = await this.getUserData(userId);

    userData.bank += bank;

    await this.client.grpc.economy.updateBank(userId, bank);
  }

  public async editBankCap(userId: string, bankCap: number) {
    const userData = await this.getUserData(userId);

    userData.bankCap += bankCap;

    await this.client.grpc.economy.updateBankCap(userId, bankCap);
  }

  // inventory
  public async getUserInventory(userId: string) {
    let userInventory = this.inventoryCache.get(userId);

    if (!userInventory) {
      userInventory = await this.client.grpc.economy.getUserInventory(userId) || [];
      this.inventoryCache.set(userId, userInventory);
    }

    return userInventory;
  }

  public async getInventoryItem(userId: string, itemId: string) {
    const userInventory = await this.getUserInventory(userId);

    return userInventory.find(item => item.itemId === itemId);
  }

  public async addInventoryItem(userId: string, item: Item) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (existingItem) {
      Object.assign(existingItem, item);
      existingItem.count++;

      await this.client.grpc.economy.addInventoryItem(userId, existingItem);
    } else {
      const newItem = await this.client.grpc.economy.addInventoryItem(userId, item);

      userItems.push(newItem);
    }
  }

  public async updateInventoryItem(userId: string, item: Item) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (!existingItem) return;
    await this.client.grpc.economy.addInventoryItem(userId, item);

    Object.assign(existingItem, item);
  }

  public async removeInventoryItem(userId: string, item: Item) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.count -= item.count;

      if (existingItem.count <= 0) {
        await this.client.grpc.economy.deleteInventoryItem(userId, existingItem);

        userItems.splice(userItems.findIndex(i => i.id === item.id), 1);
        return;
      }

      await this.client.grpc.economy.removeInventoryItem(userId, existingItem);
      return;
    }

    userItems.splice(userItems.findIndex(uItem => uItem.id === item.id), 1);

    await this.client.grpc.economy.deleteInventoryItem(userId, item);
  }

  public async removeInventoryItems(userId: string, excludeList: string[]) {
    const userItems = await this.getUserInventory(userId);
    const newInventory = userItems.filter(item => excludeList.includes(item.itemId) || !item.canBeSold);
    this.inventoryCache.set(userId, newInventory);

    await this.client.grpc.economy.deleteInventoryItems(userId, excludeList);
  }

  // Active Item bullshit
  public async getActiveItems(userId: string) {
    let userActiveItems = this.activeItemsCache.get(userId);

    if (!userActiveItems) {
      userActiveItems = await this.client.grpc.economy.getActiveItems(userId) || [];
      this.activeItemsCache.set(userId, userActiveItems);
    }

    return userActiveItems;
  }

  public async getActiveItem(userId: string, itemId: number | string) {
    const activeItems = await this.getActiveItems(userId);

    return activeItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  public async setActiveItem(userId: string, guildId: string, item: Item) {
    const activeItems = await this.getActiveItems(userId);
    const newActiveItem = await this.client.grpc.economy.addActiveItem(userId, Object.assign(item, { guildId, timeUsed: new Date() }));

    activeItems.push(newActiveItem);

    this.activeItemsCache.set(userId, activeItems);

    if (newActiveItem.usageTime) {
      const timer = {
        userId,
        guildId,
        type: 'activeItemTimer',
        time: item.timeUsed.getTime() + item.usageTime,
        itemId: newActiveItem.id,
      };

      await this.client.modules.eventTimer.setupTimer(timer);
    }
  }

  public async removeActiveItem(userId: string, item: ActiveItem) {
    const userActiveItems = await this.getActiveItems(userId);

    userActiveItems.splice(userActiveItems.findIndex(uItem => uItem.id === item.id), 1);

    this.activeItemsCache.set(userId, userActiveItems);

    await this.client.grpc.economy.removeActiveItem(userId, item);
  }

  public async getMultiplier(userId: string) {
    const x2 = await this.getActiveItem(userId, 'x2wings');

    let multiplier = 1;
    if (x2) multiplier += 1;

    return multiplier;
  }

  // leaderboard
  public async getTopTen() {
    const userList = await this.client.grpc.economy.getTopTen() as TopTenUser[];

    return userList;
  }

  // gang shit thats all im on
  public async joinGang(userId: string, gangId: string) {
    const userData = await this.getUserData(userId);

    userData.gangId = gangId;

    await this.client.grpc.economy.joinGang(userId, gangId);
  }

  public async leaveGang(userId: string) {
    const userData = await this.getUserData(userId);

    userData.gangId = '';

    await this.client.grpc.economy.leaveGang(userId);
  }
}
