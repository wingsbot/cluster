import type { Shard } from '../../../Shard';

export class ModuleBase {
  readonly client: Shard;

  constructor(client: Shard) {
    this.client = client;
  }
}
