import type { Inventory, PrismaClient } from '@prisma/client';

export class InventoryDatabase {
  constructor(private client: PrismaClient, private database: PrismaClient['inventory']) {}

  async getUserInventory(userId: string): Promise<Inventory[]> {
    return this.database.findMany({
      where: {
        userId,
      },
    });
  }

  async addItem(item: Inventory) {
    if (item.id) return this.database.update({
      where: {
        id: item.id,
      },
      data: item,
    });

    return this.database.create({
      data: item,
    });
  }

  async updateItem(item: Inventory) {
    if (item.id) return this.database.update({
      where: {
        id: item.id,
      },
      data: item,
    });

    return this.database.create({
      data: item,
    });
  }

  async removeItem(id: number) {
    return this.database.update({
      where: {
        id,
      },
      data: {
        quantity: {
          decrement: 1n,
        },
      },
    });
  }

  async deleteItem(id: number) {
    return this.database.delete({
      where: {
        id,
      },
    });
  }

  async deleteMultipleItems(userId: string, excludeList: string[]) {
    return this.database.deleteMany({
      where: {
        itemId: {
          notIn: excludeList,
        },
        canBeSold: true,
        userId,
      },
    });
  }
}
