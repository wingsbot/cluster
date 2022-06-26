"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShopDatabase = void 0;
class ShopDatabase {
    constructor(client, database) {
        this.client = client;
        this.database = database;
    }
    async getItem(id) {
        return this.database.findUnique({
            where: {
                id,
            },
        });
    }
    async getAllItems() {
        return this.database.findMany();
    }
    async addItem(item) {
        return this.database.create({
            data: item,
        });
    }
    async deleteItem(id) {
        return this.database.delete({
            where: {
                id,
            },
        });
    }
}
exports.ShopDatabase = ShopDatabase;
