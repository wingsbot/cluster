import type { Shard } from '../../Shard';
// eslint-disable-next-line no-promise-executor-return
const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface clustersEval {
  guilds: number;
  channels: number;
  users: number;
  voiceConnections: number;
}

export class IPC {
  readonly client: Shard;

  constructor(client: Shard) {
    this.client = client;

    this.client.on('ipc', this.onMessage.bind(this));
  }

  private async onMessage(message: any) {
    switch (message.op) {
      case 'eval': {
        try {
          const result = await eval(message.input);
          if (message.id) process.send({ op: 'RESULT', id: message.id, output: result });
        } catch (error: any) {
          if (message.id) process.send({ op: 'RESULT', id: message.id, output: error.stack });
        }

        break;
      }

      case 'initiateRestart': {
        await sleep(this.client.totalShards * 10000 * (this.client.clusterId - 1));

        process.exit(1);
        break;
      }

      case 'result': {
        this.client.emit(`RESULT_${message.id}`, message.results);
        break;
      }

      case 'restartCluster': {
        if (!message.data) return;

        process.send({ op: 'RESTART_CLUSTER', data: message.data });
        break;
      }

      case 'restartAllClusters': {
        process.send({ op: 'RESTART_ALL_CLUSTERS', data: message.data });
        break;
      }

      case 'sendClusterData': {
        this.client.emit('fetchClusterId', message.data);
        break;
      }

      default: {
        break;
      }
    }
  }

  public async request(op: string, data = {}) {
    const id = this.client.util.generateId();

    return new Promise(resolve => {
      process.send(Object.assign(data, { op, id }));
      this.client.once(`RESULT_${id}`, resolve);
    });
  }

  public async getClusterId(clusterId: number) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.client.removeAllListeners('clusterInfo');
        // eslint-disable-next-line prefer-promise-reject-errors
        reject('Request timed out!');
      }, 15 * 1000);

      this.request('FETCH_CLUSTER', { data: clusterId });
      this.client.once('fetchClusterId', (data: any) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  }

  public async globalEval(code: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return this.request('INCOMING_EVAL', { target: 'all', input: code }) as any;
  }

  public async getBotStats(): Promise<clustersEval> {
    const clustersEval = await this.globalEval(`(async => { return {
      guilds: this.client.guilds.size,
      channels: Object.values(this.client.channelGuildMap).length,
      users: this.client.users.size,
      voiceConnections: this.client.voiceConnections.size,
    }})();`);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return clustersEval.reduce((outerArray: clustersEval, innerArray: clustersEval) => {
      outerArray.guilds += innerArray.guilds;
      outerArray.channels += innerArray.channels;
      outerArray.users += innerArray.users;
      outerArray.voiceConnections += innerArray.voiceConnections;
      return outerArray;
    },
    { guilds: 0, channels: 0, users: 0, voiceConnections: 0 });
  }
}
