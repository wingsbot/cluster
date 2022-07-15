import type { ActiveItem, Inventory } from '@prisma/client';
import { UserData } from '@wings/database/structures';
import { ModuleBase } from '../lib/framework/bases';

export class Economy extends ModuleBase {
  readonly userCache: Map<string, UserData> = new Map();
  readonly inventoryCache: Map<string, Inventory[]> = new Map();
  readonly activeItemsCache: Map<string, ActiveItem[]> = new Map();

  async getUserData(userId: string): Promise<UserData> {
    const userCache = this.userCache.get(userId);
    if (userCache) return userCache;

    const userData = await this.client.db.user.getUser(userId);
    const user = new UserData(userData);
    this.userCache.set(userId, user);

    return user;
  }

  parseInt(amount?: number) {
    if (!amount && Number(amount) !== 0) return '🍖';
    return `🍖${amount.toLocaleString()}`;
  }

  async editBalance(userId: string, balance: number) {
    const userData = await this.getUserData(userId);

    userData.balance += balance;

    await this.client.db.user.editUserBalance(userId, balance);
  }

  async editBank(userId: string, bank: number) {
    const userData = await this.getUserData(userId);

    userData.bank += bank;

    await this.client.db.user.editUserBank(userId, bank);
  }

  async editBankCap(userId: string, bankCap: number) {
    const userData = await this.getUserData(userId);

    userData.bankCap += bankCap;

    await this.client.db.user.editUserBankCap(userId, bankCap);
  }

  // inventory
  async getUserInventory(userId: string) {
    let userInventory = this.inventoryCache.get(userId);

    if (!userInventory) {
      userInventory = await this.client.db.inventory.getUserInventory(userId) || [];
      this.inventoryCache.set(userId, userInventory);
    }

    return userInventory;
  }

  async getInventoryItem(userId: string, itemId: string) {
    const userInventory = await this.getUserInventory(userId);

    return userInventory.find(item => item.itemId === itemId);
  }

  async addInventoryItem(userId: string, item: Inventory) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(index => index.id === item.id);

    if (existingItem) {
      Object.assign(existingItem, item);
      existingItem.quantity++;

      await this.client.db.inventory.addItem(existingItem);
    } else {
      item.userId = userId;
      const newItem = await this.client.db.inventory.addItem(item);

      userItems.push(newItem);
    }
  }

  async updateInventoryItem(userId: string, item: Inventory) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(index => index.id === item.id);

    if (!existingItem) return;
    await this.client.db.inventory.updateItem(item);

    Object.assign(existingItem, item);
  }

  async removeInventoryItem(userId: string, item: Inventory) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(index => index.id === item.id);

    if (existingItem) {
      existingItem.quantity -= item.quantity;

      if (existingItem.quantity <= 0) {
        await this.client.db.inventory.deleteItem(existingItem.id);

        userItems.splice(userItems.findIndex(index => index.id === item.id), 1);
        return;
      }

      await this.client.db.inventory.removeItem(existingItem.id);
      return;
    }

    userItems.splice(userItems.findIndex(uItem => uItem.id === item.id), 1);

    await this.client.db.inventory.deleteItem(item.id);
  }

  async removeInventoryItems(userId: string, excludeList: string[]) {
    const userItems = await this.getUserInventory(userId);
    const newInventory = userItems.filter(item => excludeList.includes(item.itemId) || !item.canBeSold);
    this.inventoryCache.set(userId, newInventory);

    await this.client.db.inventory.deleteMultipleItems(userId, excludeList);
  }

  // Active Item bullshit
  async getActiveItems(userId: string) {
    let userActiveItems = this.activeItemsCache.get(userId);

    if (!userActiveItems) {
      userActiveItems = await this.client.db.activeItems.getUserActiveItem(userId) || [];
      this.activeItemsCache.set(userId, userActiveItems);
    }

    return userActiveItems;
  }

  async getActiveItem(userId: string, itemId: number | string) {
    const activeItems = await this.getActiveItems(userId);

    return activeItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  async setActiveItem(userId: string, guildId: string, item: Inventory) {
    const activeItems = await this.getActiveItems(userId);

    const newActiveItem = await this.client.db.activeItems.addItem(Object.assign(item, { guildId }));

    activeItems.push(newActiveItem);

    this.activeItemsCache.set(userId, activeItems);

    if (newActiveItem.usageTime) {
      const timer = {
        id: undefined,
        userId,
        guildId,
        type: 'activeItemTimer',
        time: BigInt(item.timeUsed.getTime()) + item.usageTime,
        itemId: newActiveItem.id,
      };

      await this.client.modules.eventTimer.setupTimer(timer);
    }
  }

  async removeActiveItem(userId: string, item: ActiveItem) {
    const userActiveItems = await this.getActiveItems(userId);

    userActiveItems.splice(userActiveItems.findIndex(uItem => uItem.id === item.id), 1);

    this.activeItemsCache.set(userId, userActiveItems);

    await this.client.db.activeItems.deleteItem(item.id);
  }

  async getMultiplier(userId: string) {
    const x2 = await this.getActiveItem(userId, 'x2wings');

    let multiplier = 1;
    if (x2) multiplier += 1;

    return multiplier;
  }

  // leaderboard
  async getTopTen() {
    return this.client.db.user.getTopTen();
  }

  // gang shit thats all im on
  async joinGang(userId: string, gangId: string) {
    await this.client.db.user.setGangId(userId, gangId);
  }

  async leaveGang(userId: string) {
    await this.client.db.user.setGangId(userId, '');
  }
}
