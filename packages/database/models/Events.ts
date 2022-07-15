import type { Events, PrismaClient } from '../generated';

export class EventsDatabase {
  constructor(private client: PrismaClient, private database: PrismaClient['events']) {}

  async getEvent(id: number): Promise<Events> {
    return this.database.findUnique({
      where: {
        id,
      },
    });
  }

  async getAllEvents() {
    return this.database.findMany();
  }

  async addEvent(event: Events) {
    return this.database.create({
      data: event,
    });
  }

  async deleteEvent(id: number) {
    return this.database.delete({
      where: {
        id,
      },
    });
  }
}
