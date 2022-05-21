import type { Shard } from '../../../Shard';
import { Store } from '../../core/fs/Store';

export class EventBase {
  public client: Shard;
  public name: string;
  public store: Store;

  constructor(client: Shard, name: string, store: Store) {
    this.client = client;
    this.name = name;
    this.store = store;

    this.listen();
  }

  async run(_args: any) {
    throw new Error('name didnt implement a run function');
  }

  private async _run(args: any) {
    try {
      await this.run(args);
    } catch (error: any) {
      this.client.emit('eventError', error);
    }
  }

  private listen() {
    this.client.on(this.name, this._run.bind(this));
  }

  private unlisten() {
    this.client.removeListener(this.name, this._run.bind(this));
  }
}
