import type { Client } from '../../Client';
import { Economy, EventTimer, Levels/*, Shop, Gangs*/ } from '../../modules';

type ModuleTypes = 'economy' | 'eventtimer' | 'gangs' | 'levels' | 'shop';

export class ModuleHandler {
  economy: Economy;
  eventTimer: EventTimer;
  levels: Levels;
  // shop: Shop;

  constructor(public client: Client) {
    this.loadAllModules();
  }

  reloadModule(name: ModuleTypes) {
    switch (name.toLowerCase()) {
    case 'economy': {
      this.economy = new Economy(this.client);

      break;
    }

    case 'eventtimer': {
      this.eventTimer = new EventTimer(this.client);

      break;
    }

    case 'gangs': {
      // this.gangs = new Gangs(this.client);

      break;
    }

    case 'levels': {
      this.levels = new Levels(this.client);

      break;
    }

    case 'shop': {
      // this.shop = new Shop(this.client);

      break;
    }

    default: {
      throw new Error('Module not found.');
    }
    }
  }

  private async loadAllModules() {
    await Promise.all([
      this.economy = new Economy(this.client),
      this.eventTimer = new EventTimer(this.client),
      this.levels = new Levels(this.client),
      // this.shop = new Shop(this.client),
    ]);
  }

  reloadAllModules() {
    this.loadAllModules();
  }
}
