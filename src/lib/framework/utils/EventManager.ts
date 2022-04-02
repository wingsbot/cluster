
import EventEmitter from 'node:events';
import { TimedEvent } from '../../interfaces/EventTimer';
import { Default } from './timers/Default';

export class EventManager extends EventEmitter {
  private readonly pendingEvents: TimedEvent[] = [];
  private readonly cutOff: number = 1000 * 60 * 60 * 24 * 7;

  constructor() {
    super();

    setInterval(this.checkPending.bind(this), 60 * 1000);
  }

  private async checkPending() {
    const pending = this.pendingEvents.filter(timer => timer.time - Date.now() <= this.cutOff);

    if (pending.length <= 0) return;

    for (const event of pending) {
      event.time = Date.now() + (Number(event.time) - Date.now());

      this.setupTimer(event);
      this.pendingEvents.splice(this.pendingEvents.findIndex(timer => timer.id === event.id), 1);
    }
  }

  public setupTimer(timer: TimedEvent) {
    const { type } = timer;

    switch (type) {
      case 'activeItemTimer': {
        (new Default(this, timer)).update();
        break;
      }

      default: {
        throw new Error(`An unknown timer type was added, ${type}`);
      }
    }
  }

  public queueEvent(timer: TimedEvent) {
    if (timer.time - Date.now() <= this.cutOff) {
      this.setupTimer(timer);
    } else {
      this.pendingEvents.push(timer);
    }
  }
}
