import type { TopTenUser, UserData } from '../lib/interfaces/Economy';
import { ModuleBase } from '../lib/framework/bases/ModuleBase';
import { ActiveItem, Item } from '../lib/interfaces/Shop';

export class Economy extends ModuleBase {
  public readonly userCache: Map<string, UserData> = new Map();
  public readonly inventoryCache: Map<string, Item[]> = new Map();
  public readonly activeItemsCache: Map<string, ActiveItem[]> = new Map();

  public async getUserData(userId: string): Promise<UserData> {
    if (this.userCache.has(userId)) return this.userCache.get(userId);

    const grpcUserData = await this.client.grpc.economy.getUser(userId);
    const userData = Object.assign(grpcUserData, {
      balance: Number(grpcUserData.balance),
      bank: Number(grpcUserData.bank),
      bankCap: Number(grpcUserData.bankCap),
    });

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

    await this.client.grpc.economy.updateBalance(userId, userData.balance.toString());
  }

  public async editBank(userId: string, bank: number) {
    const userData = await this.getUserData(userId);

    userData.bank += bank;

    await this.client.grpc.economy.updateBank(userId, userData.bank.toString());
  }

  public async editBankCap(userId: string, bankCap: number) {
    const userData = await this.getUserData(userId);

    userData.bankCap += bankCap;

    await this.client.grpc.economy.updateBankCap(userId, userData.bankCap.toString());
  }

  // inventory
  public async getUserInventory(userId: string) {
    if (this.inventoryCache.has(userId)) return this.inventoryCache.get(userId);

    const grpcUserInventory = await this.client.grpc.economy.getUserInventory(userId) || [];
    const userInventory: Item[] = [];

    for (const item of grpcUserInventory) {
      userInventory.push(Object.assign(item, {
        price: Number(item.price),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: Number(item.cooldownBetweenPurchase) }),
        ...(item.usageTime && { usageTime: Number(item.usageTime) }),
      }));
    }

    this.inventoryCache.set(userId, userInventory);
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

      const grpcItem = Object.assign(existingItem, {
        price: item.price.toString(),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
        ...(item.usageTime && { usageTime: item.usageTime.toString() }),
      });

      await this.client.grpc.economy.addInventoryItem(userId, grpcItem);
    } else {
      const grpcItem = Object.assign(item, {
        price: item.price.toString(),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
        ...(item.usageTime && { usageTime: item.usageTime.toString() }),
      });

      const newGrpcItem = await this.client.grpc.economy.addInventoryItem(userId, grpcItem);
      const newItem = Object.assign(newGrpcItem, {
        price: Number(item.price),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: Number(item.cooldownBetweenPurchase) }),
        ...(item.usageTime && { usageTime: Number(item.usageTime) }),
      });

      userItems.push(newItem);
    }
  }

  public async updateInventoryItem(userId: string, item: Item) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (!existingItem) return;
    const grpcItem = Object.assign(item, {
      price: item.price.toString(),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
      ...(item.usageTime && { usageTime: item.usageTime.toString() }),
    });

    await this.client.grpc.economy.addInventoryItem(userId, grpcItem);

    Object.assign(existingItem, item);
  }

  public async removeInventoryItem(userId: string, item: Item) {
    const userItems = await this.getUserInventory(userId);
    const existingItem = userItems.find(i => i.id === item.id);

    if (existingItem) {
      existingItem.count -= item.count;

      if (existingItem.count <= 0) {
        const grpcItem = Object.assign(existingItem, {
          price: item.price.toString(),
          ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
          ...(item.usageTime && { usageTime: item.usageTime.toString() }),
        });

        await this.client.grpc.economy.deleteInventoryItem(userId, grpcItem);

        userItems.splice(userItems.findIndex(i => i.id === item.id), 1);
        return;
      }

      const grpcItem = Object.assign(item, {
        price: item.price.toString(),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
        ...(item.usageTime && { usageTime: item.usageTime.toString() }),
      });

      await this.client.grpc.economy.removeInventoryItem(userId, grpcItem);
      return;
    }

    userItems.splice(userItems.findIndex(uItem => uItem.id === item.id), 1);

    const grpcItem = Object.assign(item, {
      price: item.price.toString(),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
      ...(item.usageTime && { usageTime: item.usageTime.toString() }),
    });

    await this.client.grpc.economy.deleteInventoryItem(userId, grpcItem);
  }

  public async removeInventoryItems(userId: string, excludeList: string[]) {
    const userItems = await this.getUserInventory(userId);
    const newInventory = userItems.filter(item => excludeList.includes(item.itemId) || !item.canBeSold);
    this.inventoryCache.set(userId, newInventory);

    await this.client.grpc.economy.deleteInventoryItems(userId, excludeList);
  }

  // Active Item bullshit
  public async getActiveItems(userId: string) {
    if (this.activeItemsCache.has(userId)) return this.activeItemsCache.get(userId);

    const grpcUserActiveItems = await this.client.grpc.economy.getActiveItems(userId) || [];
    const userAciveItems: ActiveItem[] = [];

    for (const item of grpcUserActiveItems) {
      userAciveItems.push(Object.assign(item, {
        price: Number(item.price),
        ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: Number(item.cooldownBetweenPurchase) }),
        ...(item.usageTime && { usageTime: Number(item.usageTime) }),
      }));
    }

    this.activeItemsCache.set(userId, userAciveItems);
    return userAciveItems;
  }

  public async getActiveItem(userId: string, itemId: number | string) {
    const activeItems = await this.getActiveItems(userId);

    return activeItems.find(item => typeof itemId === 'string' ? item.itemId === itemId : item.id === itemId);
  }

  public async setActiveItem(userId: string, guildId: string, item: Item) {
    const activeItems = await this.getActiveItems(userId);
    const grpcItem = Object.assign(item, {
      price: item.price.toString(),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
      ...(item.usageTime && { usageTime: item.usageTime.toString() }),
      guildId,
      timeUsed: new Date(),
    });

    const newGrpcActiveItem = await this.client.grpc.economy.addActiveItem(userId, grpcItem);
    const newActiveItem = Object.assign(newGrpcActiveItem, {
      price: Number(item.price),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: Number(item.cooldownBetweenPurchase) }),
      ...(item.usageTime && { usageTime: Number(item.usageTime) }),
    });

    activeItems.push(newActiveItem);

    this.activeItemsCache.set(userId, activeItems);

    if (newActiveItem.usageTime) {
      const timer = {
        userId,
        guildId,
        type: 'activeItemTimer',
        time: (newActiveItem.timeUsed.getTime() + newActiveItem.usageTime).toString(),
        itemId: newActiveItem.id,
      };

      await this.client.modules.eventTimer.setupTimer(timer);
    }
  }

  public async removeActiveItem(userId: string, item: ActiveItem) {
    const userActiveItems = await this.getActiveItems(userId);

    userActiveItems.splice(userActiveItems.findIndex(uItem => uItem.id === item.id), 1);

    this.activeItemsCache.set(userId, userActiveItems);

    const grpcItem = Object.assign(item, {
      price: item.price.toString(),
      ...(item.cooldownBetweenPurchase && { cooldownBetweenPurchase: item.cooldownBetweenPurchase.toString() }),
      ...(item.usageTime && { usageTime: item.usageTime.toString() }),
    });

    await this.client.grpc.economy.removeActiveItem(userId, grpcItem);
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
