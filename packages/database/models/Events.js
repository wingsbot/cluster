"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsDatabase = void 0;
class EventsDatabase {
    constructor(client, database) {
        this.client = client;
        this.database = database;
    }
    async getEvent(id) {
        return this.database.findUnique({
            where: {
                id,
            },
        });
    }
    async getAllEvents() {
        return this.database.findMany();
    }
    async addEvent(event) {
        return this.database.create({
            data: event,
        });
    }
    async deleteEvent(id) {
        return this.database.delete({
            where: {
                id,
            },
        });
    }
}
exports.EventsDatabase = EventsDatabase;
