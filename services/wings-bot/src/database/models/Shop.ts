import type { Shop, PrismaClient } from '@prisma/client';

export class ShopDatabase {
  constructor(private client: PrismaClient, private database: PrismaClient['shop']) {}

  async getItem(id: number): Promise<Shop> {
    return this.database.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllItems() {
    return this.database.findMany();
  }

  async addItem(item: Shop) {
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
