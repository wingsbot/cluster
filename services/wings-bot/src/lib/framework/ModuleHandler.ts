import { Economy } from '../../modules/Economy';
import { Shop } from '../../modules/Shop';
import type { Shard } from '../../Shard';
import { Levels } from '../../modules/Levels';
import { EventTimer } from '../../modules/EventTimer';
import { Client } from '../..';
// import { Gangs } from '../../modules/Gangs.disabled';

export class ModuleHandler {
  public economy: Economy;
  public eventTimer: EventTimer;
  public levels: Levels;
  public shop: Shop;

  constructor(public client: Client) {
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
        // this.client.modules.gangs = new Gangs(this.client);

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

  private async loadAllModules() {
    await Promise.all([
      this.economy = new Economy(this.client),
      this.eventTimer = new EventTimer(this.client),
      this.levels = new Levels(this.client),
      this.shop = new Shop(this.client),
    ]);
  }

  public reloadAllModules() {
    this.loadAllModules();
  }
}
