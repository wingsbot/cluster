import type { TimedEvent } from '../../../interfaces/EventTimer';
import type { EventManager } from '../EventManager';

export class Default {
  private readonly manager: EventManager;
  private readonly timer: TimedEvent;

  constructor(manager: EventManager, timer: TimedEvent) {
    this.manager = manager;
    this.timer = timer;
  }

  async update() {
    const { time } = this.timer;
    if (time - Date.now() <= 0) {
      this.manager.emit('eventExpire', this.timer);
      return;
    }

    const interval = time - Date.now() <= 10000 ? 1000 : (Number(time) - Date.now()) / 10;
    setTimeout(this.update.bind(this), interval);
  }
}
