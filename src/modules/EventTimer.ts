import type { Shard } from '../Shard';
import { ModuleBase } from '../lib/framework/bases/ModuleBase';
import { EventManager } from '../lib/framework/utils/EventManager';
import { EventItem, TimedEvent } from '../lib/interfaces/EventTimer';

export class EventTimer extends ModuleBase {
  private readonly eventManager: EventManager = new EventManager();
  private readonly timers: TimedEvent[] = [];

  constructor(client: Shard) {
    super(client);

    this.eventManager.on('eventExpire', this.handleEvent.bind(this));
    this.client.once('ready', this.setup.bind(this));
  }

  private async setup() {
    const timers = await this.client.grpc.timedEvents.getAllEvents();

    for (const timer of timers) {
      if (timer.guildId) {
        const shardId = (Number(timer.guildId) >> 22) % this.client.totalShards;
        if (!this.client.shards.find(s => s.id === shardId)) continue;
      }

      this.eventManager.queueEvent(timer);
      this.timers.push(timer);
    }
  }

  private async handleEvent(timer: TimedEvent) {
    if (!timer) return;

    switch (timer.type) {
      case 'activeItemTimer': {
        const item = await this.client.grpc.timedEvents.getEventItem(timer.id);

        this.client.modules.economy.removeActiveItem(timer.userId, item);
        break;
      }

      case 'limitedItemTimer': {
        const item = await this.client.grpc.timedEvents.getEventItem(timer.id);

        this.client.modules.shop.removeSpecialItem(item);
        break;
      }

      default: {
        throw new Error(`Unhandled timedAction ${timer.type}`);
      }
    }

    this.expireEvent(timer);
  }

  private expireEvent(timer: TimedEvent) {
    const index = this.timers.findIndex(t => t.id === timer.id);
    if (index === -1) return;

    this.timers.splice(index, 1);
    this.client.grpc.timedEvents.removeEvent(timer.id);
  }

  public async setupTimer(timer: TimedEvent, item: EventItem) {
    const timerData = await this.client.grpc.timedEvents.addEvent(timer, item);

    timer.id = timerData.id;
    this.timers.push(timer);

    this.eventManager.queueEvent(timer);
  }
}
