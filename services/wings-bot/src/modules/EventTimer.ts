
import type { Events } from '@prisma/client';
import type { Shard } from '../Shard';

import { ModuleBase, EventManager } from '../lib/framework';

export class EventTimer extends ModuleBase {
  private readonly eventManager: EventManager = new EventManager();
  private readonly timers: Events[] = [];

  constructor(client: Shard) {
    super(client);

    this.eventManager.on('eventExpire', this.handleEvent.bind(this));
    this.client.once('ready', this.setup.bind(this));
  }

  private async setup() {
    const timers = await this.client.db.events.getAllEvents();

    for (const timer of timers) {
      if (timer.guildId) {
        const shardId = (Number(timer.guildId) >> 22) % this.client.totalShards;
        if (!this.client.shards.find(s => s.id === shardId)) continue;
      }

      this.eventManager.queueEvent(timer);
      this.timers.push(timer);
    }
  }

  private async handleEvent(timer: Events) {
    if (!timer) return;

    switch (timer.type) {
      case 'activeItemTimer': {
        const item = await this.client.modules.economy.getActiveItem(timer.userId, timer.itemId);

        this.client.modules.economy.removeActiveItem(timer.userId, item);
        break;
      }

      case 'limitedItemTimer': {
        const item = this.client.modules.shop.getShopItem(timer.itemId);

        this.client.modules.shop.removeSpecialItem(item);
        break;
      }

      default: {
        throw new Error(`Unhandled timedAction ${timer.type}`);
      }
    }

    this.expireEvent(timer);
  }

  private expireEvent(timer: Events) {
    const index = this.timers.findIndex(t => t.id === timer.id);
    if (index === -1) return;

    this.timers.splice(index, 1);
    this.client.db.events.deleteEvent(timer.id);
  }

  public async setupTimer(timer: Events) {
    const timerData = await this.client.db.events.addEvent(timer);

    timer.id = timerData.id;
    this.timers.push(timer);

    this.eventManager.queueEvent(timer);
  }
}
