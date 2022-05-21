import { ActiveItem, PrismaClient } from '@prisma/client';

export class ActiveItemsDatabase {
  readonly client: PrismaClient;
  readonly database: PrismaClient['activeItem'];

  constructor(client: PrismaClient, activeItems: PrismaClient['activeItem']) {
    this.client = client;
    this.database = activeItems;
  }

  async getUserActiveItem(userId: string): Promise<ActiveItem[]> {
    return this.database.findMany({
      where: {
        userId,
      },
    });
  }

  async addItem(item: ActiveItem) {
    return this.database.create({
      data: item,
    });
  }

  async deleteItem(id: number) {
    return this.database.delete({
      where: {
        id,
      },
    });
  }
}
