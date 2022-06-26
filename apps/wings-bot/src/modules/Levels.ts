import { CommandInteraction } from 'eris';

import { ModuleBase } from '../lib/framework/bases';
import type { UserLevelData } from '../lib/interfaces/Levels';

export class Levels extends ModuleBase {
  private readonly levelCache: Map<string, UserLevelData> = new Map();

  async handleLeveling(interaction: CommandInteraction) {
    if (!interaction.member) return;

    let cachedUser = this.levelCache.get(interaction.member.id);
    if (!cachedUser) cachedUser = await this.getUserData(interaction.member.id);

    if (Date.now() - cachedUser.cooldown < 1000 * 60) return;

    const xpFromLastLevel = this.xpRequiredForLevel(cachedUser.level);
    const xpTillNextLevel = this.xpRequiredForLevel(cachedUser.level + 1);
    let xpToFinishLevel = this.xpToFinishLevel(cachedUser.level);

    const amount = this.client.utils.getRandomInt(10, 15);

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

    this.levelCache.set(interaction.member.id, cachedUser);
    await this.client.db.user.updateLevel(interaction.member.id, cachedUser);
  }

  xpRequiredForLevel(level: number) {
    return Math.round(5 / 6 * level * ((2 * level * level) + (27 * level) + 91));
  }

  xpToFinishLevel(level: number) {
    return Math.round((5 * (level ** 2)) + (50 * level) + 100);
  }

  async getUserData(userId: string): Promise<UserLevelData> {
    if (this.levelCache.has(userId)) return this.levelCache.get(userId);

    const data = await this.client.db.user.getUser(userId);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return data.levelData as any;
  }

  async getUserRank(userId: string) {
    const users = await this.client.db.user.getAllUsersLevel();
    return users.findIndex(user => user.id === userId) + 1;
  }
}
