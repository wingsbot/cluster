import { Events, PrismaClient } from '@prisma/client';

export class EventsDatabase {
  readonly client: PrismaClient;
  readonly database: PrismaClient['events'];

  constructor(client: PrismaClient, events: PrismaClient['events']) {
    this.client = client;
    this.database = events;
  }

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
