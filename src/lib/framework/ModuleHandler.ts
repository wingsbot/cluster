import { Economy } from '../../modules/Economy';
import { Shop } from '../../modules/Shop';
import type { Shard } from '../../Shard';
import { Levels } from '../../modules/Levels';
import { EventTimer } from '../../modules/EventTimer';
import { Gangs } from '../../modules/Gangs';

export interface Modules {
  economy: Economy;
  eventTimer: EventTimer;
  gangs: Gangs;
  levels: Levels;
  shop: Shop;
}

export class ModuleHandler {
  private readonly client: Shard;

  constructor(client: Shard) {
    this.client = client;

    this.loadAllModules();
  }

  public reloadModule(name: string) {
    switch (name.toLowerCase()) {
      case 'economy': {
        this.client.modules.economy = new Economy(this.client);

        break;
      }

      case 'eventtimer': {
        this.client.modules.eventTimer = new EventTimer(this.client);

        break;
      }

      case 'gangs': {
        this.client.modules.gangs = new Gangs(this.client);

        break;
      }

      case 'levels': {
        this.client.modules.levels = new Levels(this.client);

        break;
      }

      case 'shop': {
        this.client.modules.shop = new Shop(this.client);

        break;
      }

      default: {
        throw new Error('Module not found.');
      }
    }
  }

  private loadAllModules() {
    this.client.modules = {
      economy: new Economy(this.client),
      eventTimer: new EventTimer(this.client),
      gangs: new Gangs(this.client),
      levels: new Levels(this.client),
      shop: new Shop(this.client),
    };
  }

  public reloadAllModules() {
    this.loadAllModules();
  }
}
