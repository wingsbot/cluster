"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActiveItemsDatabase = void 0;
class ActiveItemsDatabase {
    constructor(client, database) {
        this.client = client;
        this.database = database;
    }
    async getUserActiveItem(userId) {
        return this.database.findMany({
            where: {
                userId,
            },
        });
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
exports.ActiveItemsDatabase = ActiveItemsDatabase;
