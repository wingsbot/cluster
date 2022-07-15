import type { Events } from '@wings/database';
import type { EventManager } from '../EventManager';

export class Default {
  private readonly manager: EventManager;
  private readonly timer: Events;

  constructor(manager: EventManager, timer: Events) {
    this.manager = manager;
    this.timer = timer;
  }

  async update() {
    const { time } = this.timer;
    if (Number(time) - Date.now() <= 0) {
      this.manager.emit('eventExpire', this.timer);
      return;
    }

    const interval = Number(time) - Date.now() <= 10_000 ? 1000 : (Number(time) - Date.now()) / 10;
    setTimeout(this.update.bind(this), interval);
  }
}
