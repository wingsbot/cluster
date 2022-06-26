"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Database = void 0;
const client_1 = require("@prisma/client");
const models_1 = require("./models");
class Database {
    constructor() {
        this.client = new client_1.PrismaClient();
        this.activeItems = new models_1.ActiveItemsDatabase(this.client, this.client.activeItem);
        this.events = new models_1.EventsDatabase(this.client, this.client.events);
        this.inventory = new models_1.InventoryDatabase(this.client, this.client.inventory);
        this.shop = new models_1.ShopDatabase(this.client, this.client.shop);
        this.user = new models_1.UserDatabase(this.client, this.client.user);
    }
}
exports.Database = Database;
