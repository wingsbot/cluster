"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Item = void 0;
class Item {
    // TODO: Add functions and a ton more data (think about stats for the future)
    constructor(item) {
        this.id = null;
        this.name = item.name;
        this.itemId = item.itemId;
        this.description = item.description;
        this.price = item.price;
        this.canBeSold = item.canBeSold;
        this.replyMessage = item.replyMessage;
        this.quantity = item.quantity;
        this.useable = item.useable;
        this.powerUp = item.powerUp || false;
        this.cooldownBetweenPurchase = item.cooldownBetweenPurchase || null;
        this.priceStack = item.priceStack || true;
        this.durability = item.durability || null;
        this.maxDurability = item.maxDurability || null;
        this.maxInInv = item.maxInInv || null;
        this.stock = item.stock || null;
        this.usageTime = item.usageTime || null;
        this.timeBought = null;
        this.timeUsed = null;
    }
    databaseItem() {
        return {
            id: this.id,
            name: this.name,
            itemId: this.itemId,
            description: this.description,
            price: BigInt(this.price),
            canBeSold: this.canBeSold,
            replyMessage: this.replyMessage,
            quantity: BigInt(this.quantity),
            useable: this.useable,
            powerUp: this.powerUp,
            cooldownBetweenPurchase: BigInt(this.cooldownBetweenPurchase),
            priceStack: this.priceStack,
            durability: this.durability,
            maxDurability: this.maxDurability,
            maxInInv: BigInt(this.maxInInv),
            stock: BigInt(this.stock),
            usageTime: BigInt(this.usageTime),
            timeBought: this.timeBought,
            timeUsed: this.timeUsed,
        };
    }
    setId(id) {
        this.id = id;
    }
    setTimeBought(time) {
        this.timeBought = time;
    }
    setTimeUsed(time) {
        this.timeUsed = time;
    }
    addQuantity(quantity) {
        this.quantity += quantity;
    }
    removeQuantity(quantity) {
        this.quantity -= quantity;
    }
}
exports.Item = Item;
