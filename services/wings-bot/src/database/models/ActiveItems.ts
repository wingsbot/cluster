import type { ActiveItem, PrismaClient } from '@prisma/client';

export class ActiveItemsDatabase {
  constructor(private client: PrismaClient, private database: PrismaClient['activeItem']) {}

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
