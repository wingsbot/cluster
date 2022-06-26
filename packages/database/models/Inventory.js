"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryDatabase = void 0;
class InventoryDatabase {
    constructor(client, database) {
        this.client = client;
        this.database = database;
    }
    async getUserInventory(userId) {
        return this.database.findMany({
            where: {
                userId,
            },
        });
    }
    async addItem(item) {
        if (item.id)
            return this.database.update({
                where: {
                    id: item.id,
                },
                data: item,
            });
        return this.database.create({
            data: item,
        });
    }
    async updateItem(item) {
        if (item.id)
            return this.database.update({
                where: {
                    id: item.id,
                },
                data: item,
            });
        return this.database.create({
            data: item,
        });
    }
    async removeItem(id) {
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
    async deleteItem(id) {
        return this.database.delete({
            where: {
                id,
            },
        });
    }
    async deleteMultipleItems(userId, excludeList) {
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
exports.InventoryDatabase = InventoryDatabase;
