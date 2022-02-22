import { Collection } from 'mongodb';
import type { Shard } from '../Shard';
import { ModuleBase } from '../lib/framework/bases/ModuleBase';
import { EventManager } from '../lib/framework/utils/EventManager';
import type { ItemExpire, ShopItemExpire, TimerData } from '../lib/interfaces/EventTimer.d';

export class EventTimer extends ModuleBase {
  private readonly db: Collection = this.client.db.collection('timedEvents');
  private readonly eventManager: EventManager = new EventManager();
  private readonly timers: TimerData[] = [];

  constructor(client: Shard) {
    super(client);

    this.eventManager.on('eventExpire', this.handleEvent.bind(this));
    this.client.once('ready', this.setup.bind(this));
  }

  private async setup() {
    const timers = await this.db.find().toArray() as TimerData[];

    for (const timer of timers) {
      if (timer.data.guildId) {
        const shardId = (Number(timer.data.guildId) >> 22) % this.client.totalShards;
        if (!this.client.shards.find(s => s.id === shardId)) continue;
      }

      this.eventManager.queueEvent(timer);
      this.timers.push(timer);
    }
  }

  private async handleEvent(timer: TimerData) {
    if (!timer) return;

    switch (timer.type) {
      case 'activeItemTimer': {
        const data = timer.data as ItemExpire;

        this.client.modules.economy.removeActiveItem(data.userId, data.item);
        break;
      }

      case 'limitedItemTimer': {
        const data = timer.data as ShopItemExpire;

        this.client.modules.shop.removeSpecialItem(data.item);
        break;
      }

      default: {
        throw new Error(`Unhandled timedAction ${timer.type}`);
      }
    }

    this.expireEvent(timer);
  }

  private expireEvent(timer: TimerData) {
    const index = this.timers.findIndex(t => t._id === timer._id);
    if (index === -1) return;

    this.timers.splice(index, 1);
    this.db.deleteOne({ _id: timer._id });
  }

  public async setupTimer(type: string, time: number, data: TimerData['data']) {
    const timer: TimerData = {
      type,
      time,
      data,
    };

    const timerData = await this.db.insertOne(timer);

    timer._id = timerData.insertedId;
    this.timers.push(timer);

    this.eventManager.queueEvent(timer);
  }
}
