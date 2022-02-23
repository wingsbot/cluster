import { Collection } from 'mongodb';
import { Constants, Message } from 'eris';

import type { Shard } from '../Shard';
import { ModuleBase } from '../lib/framework/bases/ModuleBase';
import type { UserLevelData } from '../lib/interfaces/Levels';

export class Levels extends ModuleBase {
  private readonly db: Collection<{ _id: string }> = this.client.db.collection('levels');
  private readonly levelCache: Map<string, UserLevelData> = new Map();
  private readonly defaultLevelData: UserLevelData = {
    userId: 'none',
    exp: 0,
    level: 1,
    total: 100,
    percent: 0,
    cooldown: 0,
    levelPicture: {
      usernameColor: '#000000',
      bigSquareColor: '#d3d3d3',
      bigSquareOpacity: 0.6,
      levelColor: '#000000',
      xpColor: '#606060',
      rankColor: '#000000',
      filledDotsColor: '#606060',
      emptyDotsColor: '#d6d6d6',
      backgroundURL: 'https://i.imgur.com/FydJyTs.png',
      backgroundX: 0,
      backgroundY: 0,
      backgroundW: null,
      backgroundH: null,
    },
  };

  constructor(client: Shard) {
    super(client);

    this.setup();
  }

  private async setup() {
    await this.setupCache();

    this.client.on('messageCreate', this.handleMessages.bind(this));
  }

  private async setupCache() {
    const users = await this.db.find().toArray() as UserLevelData[];

    for (const user of users) {
      this.levelCache.set(user._id, user);
    }
  }

  private async handleMessages(message: Message) {
    if (!message.guildID || message.author.bot || (message.type !== Constants.MessageTypes.DEFAULT && message.type !== Constants.MessageTypes.REPLY)) return;

    const cachedUser = this.levelCache.get(message.author.id) ?? { ...this.defaultLevelData };
    if (Date.now() - cachedUser.cooldown < 1000 * 60) return;

    const xpFromLastLevel = this.xpRequiredForLevel(cachedUser.level);
    const xpTillNextLevel = this.xpRequiredForLevel(cachedUser.level + 1);
    let xpToFinishLevel = this.xpToFinishLevel(cachedUser.level);

    const amount = this.client.util.getRandomInt(10, 15);

    cachedUser.userId = message.author.id;
    cachedUser.total += amount;
    cachedUser.exp = cachedUser.total - xpFromLastLevel;
    cachedUser.percent = Math.round((cachedUser.exp / xpToFinishLevel) * 100);
    cachedUser.cooldown = Date.now();

    if (xpTillNextLevel <= cachedUser.total) {
      cachedUser.level++;
      cachedUser.exp = cachedUser.total - xpTillNextLevel;

      xpToFinishLevel = this.xpToFinishLevel(cachedUser.level);
      cachedUser.percent = Math.round((cachedUser.exp / xpTillNextLevel) * 100);

      // in here at special levels give cool things, plus how to notify level up?
    }

    this.levelCache.set(cachedUser.userId, cachedUser);
    this.db.updateOne({ _id: cachedUser.userId }, { $set: cachedUser }, { upsert: true });
  }

  public xpRequiredForLevel(level: number) {
    return Math.round(5 / 6 * level * ((2 * level * level) + (27 * level) + 91));
  }

  public xpToFinishLevel(level: number) {
    return Math.round((5 * (level ** 2)) + (50 * level) + 100);
  }

  public getUserData(userId: string) {
    return this.levelCache.get(userId) ?? this.defaultLevelData;
  }

  public async getUserRank(userId: string) {
    const users = await this.db.find().toArray() as UserLevelData[];
    return users.findIndex(user => user.userId === userId) + 1;
  }
}
