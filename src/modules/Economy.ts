import type { ActiveItem, Inventory, User } from '@prisma/client';
import { ModuleBase } from '../lib/framework';

export class Economy extends ModuleBase {
  public readonly userCache: Map<string, User> = new Map();
  public readonly inventoryCache: Map<string, Inventory[]> = new Map();
  public readonly activeItemsCache: Map<string, ActiveItem[]> = new Map();

  public async getUserData(userId: string): Promise<User> {
    const userCache = this.userCache.get(userId);
    if (userCache) return userCache;

    const userData = await this.client.db.user.getUser(userId);
    this.userCache.set(userId, userData);

    return userData;
  }

  public parseInt(amount?: number | bigint) {
    if (!amount && Number(amount) !== 0) return '🍖';
    return `🍖${amount.toLocaleString()}`;
  }

  public async editBalance(userId: string, balance: number | bigint) {
    const userData = await this.getUserData(userId);

    userData.balance += BigInt(balance);

    await this.client.db.user.editUserBalance(userId, BigInt(balance));
  }

  public async editBank(userId: string, bank: number | bigint) {
    const userData = await this.getUserData(userId);

    userData.bank += BigInt(bank);

    await this.client.db.user.editUserBank(userId, BigInt(bank));
  }

  public async editBankCap(userId: string, bankCap: number | bigint) {
    const userData = await this.getUserData(userId);

    userData.bankCap += BigInt(bankCap);

    await this.client.db.user.editUserBankCap(userId, BigInt(bankCap));
  }

  // inventory
  public async getUserInventory(userId: string) {
    let userInventory = this.inventoryCache.get(userId);

    if (!userInventory) {
      userInventory = await this.client.db.inventory.getUserInventory(userId) || [];
      this.inventoryCache.set(userId, userInventory);
    }

    return userInventory;
  }

  public async getInventoryItem(userId: string, itemId: string) {
    const userInventory = await this.getUserInventory(userId);

    return userInventory.find(item => item.itemId === itemId);
  }

  public async addInventoryItem(userId: string, item: Inventory) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

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

  public async updateInventoryItem(userId: string, item: Inventory) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (!existingItem) return;
    await this.client.db.inventory.updateItem(item);

    Object.assign(existingItem, item);
  }

  public async removeInventoryItem(userId: string, item: Inventory) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.quantity -= item.quantity;

      if (existingItem.quantity <= 0) {
        await this.client.db.inventory.deleteItem(existingItem.id);

        userItems.splice(userItems.findIndex(i => i.id === item.id), 1);
        return;
      }

      await this.client.db.inventory.removeItem(existingItem.id);
      return;
    }

    userItems.splice(userItems.findIndex(uItem => uItem.id === item.id), 1);

    await this.client.db.inventory.deleteItem(item.id);
  }

  public async removeInventoryItems(userId: string, excludeList: string[]) {
    const userItems = await this.getUserInventory(userId);
    const newInventory = userItems.filter(item => excludeList.includes(item.itemId) || !item.canBeSold);
    this.inventoryCache.set(userId, newInventory);

    await this.client.db.inventory.deleteMultipleItems(userId, excludeList);
  }

  // Active Item bullshit
  public async getActiveItems(userId: string) {
    let userActiveItems = this.activeItemsCache.get(userId);

    if (!userActiveItems) {
      userActiveItems = await this.client.db.activeItems.getUserActiveItem(userId) || [];
      this.activeItemsCache.set(userId, userActiveItems);
    }

    return userActiveItems;
  }

  public async getActiveItem(userId: string, itemId: number | string) {
    const activeItems = await this.getActiveItems(userId);

    return activeItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  public async setActiveItem(userId: string, guildId: string, item: ActiveItem) {
    const activeItems = await this.getActiveItems(userId);
    const newActiveItem = await this.client.db.activeItems.addItem(item);

    activeItems.push(newActiveItem);

    this.activeItemsCache.set(userId, activeItems);

    if (newActiveItem.usageTime) {
      const timer = {
        id: null,
        userId,
        guildId,
        type: 'activeItemTimer',
        time: BigInt(item.timeUsed.getTime()) + item.usageTime,
        itemId: newActiveItem.id,
      };

      await this.client.modules.eventTimer.setupTimer(timer);
    }
  }

  public async removeActiveItem(userId: string, item: ActiveItem) {
    const userActiveItems = await this.getActiveItems(userId);

    userActiveItems.splice(userActiveItems.findIndex(uItem => uItem.id === item.id), 1);

    this.activeItemsCache.set(userId, userActiveItems);

    await this.client.db.activeItems.deleteItem(item.id);
  }

  public async getMultiplier(userId: string) {
    const x2 = await this.getActiveItem(userId, 'x2wings');

    let multiplier = 1;
    if (x2) multiplier += 1;

    return multiplier;
  }

  // leaderboard
  public async getTopTen() {
    return this.client.db.user.getTopTen();
  }

  // gang shit thats all im on
  public async joinGang(userId: string, gangId: string) {
    await this.client.db.user.setGangId(userId, gangId);
  }

  public async leaveGang(userId: string) {
    await this.client.db.user.setGangId(userId, '');
  }
}
