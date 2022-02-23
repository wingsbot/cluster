import master, { Worker } from 'node:cluster';
import type { Config } from './lib/interfaces/Client';
import { config } from './lib/core';

export interface Outputs {
  results: string[];
  expected: number;
  clusterId: number;
}

export interface ClusterData {
  worker: Worker;
  range: number[];
  ready?: boolean;
}

export class Manager {
  public config: Config = config;
  public botInstance = this.config.botInstance;
  private readonly clusters: Map<number, ClusterData> = new Map();
  private readonly pendingOutputs: Map<string, Outputs> = new Map();

  public start() {
    const shardsPerCluster = Math.ceil(config.shards / config.clusters);

    for (let id = 0; id < config.clusters; id++) {
      const firstShardID = shardsPerCluster * id;
      let lastShardID = ((id + 1) * shardsPerCluster) - 1;
      if (lastShardID > config.shards - 1) lastShardID = config.shards - 1;

      setTimeout(() => {
        const worker = master.fork({
          RELEASE: process.env.RELEASE,
          botInstance: this.botInstance,
          firstShard: firstShardID,
          lastShard: lastShardID,
          range: [firstShardID, lastShardID],
          shardCount: config.shards,
          clusterId: id,
          config: JSON.stringify(config),
        });

        this.clusters.set(worker.id, { worker, range: [firstShardID, lastShardID] });
        this.handleCluster({ worker, range: [firstShardID, lastShardID] }, true);
      }, id * 1000);
    }
  }

  private handleCluster({ worker, range }: ClusterData, newCluster = false) {
    worker.on('online', async () => {
      // eslint-disable-next-line no-promise-executor-return
      if (newCluster) await new Promise(resolve => setTimeout(resolve, (worker.id - 1) * 6000));

      worker.send({ op: 'start', shards: range, totalShards: config.shards, clusterId: worker.id });
    });

    worker.on('exit', () => {
      this.clusters.delete(worker.id);

      worker = master.fork({
        RELEASE: process.env.RELEASE,
        BOT_INSTANCE: config.prodBot,
        firstShard: range[0],
        lastShard: range[1],
        range,
        shardCount: config.shards,
        clusterId: worker.id,
        config: JSON.stringify(config),
      });

      this.clusters.set(worker.id, { worker, range });
      this.handleCluster({ worker, range });
    });

    worker.on('message', async (message: any) => this.onIPCMessage({ worker, range }, message));
  }

  private async onIPCMessage({ worker, range }: ClusterData, message: any) {
    switch (message.op) {
      case 'READY': {
        console.log(`Cluster: ${worker.id} is ready (shards: ${range.join('-')})`);
        this.clusters.get(worker.id).ready = true;

        break;
      }

      case 'INCOMING_EVAL': {
        if (message.target === 'all') {
          this.pendingOutputs.set(message.id, {
            results: [],
            expected: this.clusters.size,
            clusterId: worker.id,
          });

          for (const [, cluster] of this.clusters) {
            cluster.worker.send({ op: 'eval', id: message.id, input: message.input });
          }
        } else if (message.target === 'manager') {
          try {
            const result = await eval(message.input);
            if (message.id) worker.send({ op: 'result', id: message.id, output: result });
          } catch (error: any) {
            if (message.id) worker.send({ op: 'result', id: message.id, output: error.stack });
          }
        }

        break;
      }

      case 'RESULT': {
        if (!this.pendingOutputs.get(message.id)) return;

        this.pendingOutputs.get(message.id).results.push(message.output);
        if (this.pendingOutputs.get(message.id).results.length === this.pendingOutputs.get(message.id).expected) {
          this.clusters.get(this.pendingOutputs.get(message.id).clusterId).worker.send({ op: 'result', id: message.id, results: this.pendingOutputs.get(message.id).results });
          this.pendingOutputs.delete(message.id);
        }

        break;
      }

      case 'FETCH_CLUSTER': {
        worker.send({ op: 'sendClusterData', data: this.clusters.get(message.data) });
        break;
      }

      case 'RESTART_CLUSTER': {
        this.clusters.get(message.data).worker.send({ op: 'initiateRestart' });
        break;
      }

      case 'RESTART_ALL_CLUSTERS': {
        for (const [,cluster] of this.clusters) {
          cluster.worker.send({ op: 'initiateRestart' });
        }

        break;
      }

      default: {
        break;
      }
    }
  }
}

if (master.isPrimary) {
  new Manager().start();
} else {
  import('./Shard');
}
