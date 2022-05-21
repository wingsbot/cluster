import { User, PrismaClient } from '@prisma/client';
import type { UserLevelData } from '../../interfaces/Levels';
import type { UserPatronData } from '../../interfaces/Patreons';

export class UserDatabase {
  readonly client: PrismaClient;
  readonly database: PrismaClient['user'];

  constructor(client: PrismaClient, user: PrismaClient['user']) {
    this.client = client;
    this.database = user;
  }

  async getUser(userId: string) {
    const userData = await this.database.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userData) return this.getDefaultUserData(userId, {});
    console.log(userData);
    return userData;
  }

  private async getDefaultUserData(id: string, { balance = 0n, bank = 0n, bankCap = 15000n, gangId = undefined }): Promise<User> {
    const user: User & { levelData: UserLevelData; premium: UserPatronData } = {
      id,
      balance,
      bank,
      bankCap,
      gangId,
      premium: {
        discordId: id,
        patronId: null,
        activeTiers: [],
        hasPremium: false,
      },
      levelData: {
        exp: 0,
        level: 1,
        total: 100,
        percent: 0,
        cooldown: 0,
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

    await this.database.create({ data: user });
    return user;
  }

  async editUserBalance(userId: string, balance: bigint): Promise<User> {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: balance,
          },
        },
      });
    } catch {
      userData = await this.getDefaultUserData(userId, { balance });
    }

    return userData;
  }

  async editUserBank(userId: string, bank: bigint): Promise<User> {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          bank: {
            increment: bank,
          },
        },
      });
    } catch {
      userData = await this.getDefaultUserData(userId, { bank });
    }

    return userData;
  }

  async editUserBankCap(userId: string, bankCap: bigint): Promise<User> {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          bankCap: {
            increment: bankCap,
          },
        },
      });
    } catch {
      userData = await this.getDefaultUserData(userId, { bankCap });
    }

    return userData;
  }

  async setGangId(userId: string, gangId: string | undefined): Promise<User> {
    return this.database.update({
      where: {
        id: userId,
      },
      data: {
        gangId,
      },
    });
  }

  async getTopTen(): Promise<Array<User & { summed: number }>> {
    return this.client.$queryRawUnsafe('SELECT CONVERT(balance, UNSIGNED INTEGER) + CONVERT(bank, UNSIGNED INTEGER) as summed,id FROM user ORDER BY summed DESC LIMIT 10;');
  }

  async updateLevel(userId: string, levelObject: UserLevelData): Promise<User> {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          levelData: {
            ...levelObject,
          },
        },
      });
    } catch {
      userData = await this.getDefaultUserData(userId, {});
    }

    return userData;
  }

  async updatePremium(premiumObject: UserPatronData[]) {
    for (const user of premiumObject) {
      await this.database.update({
        where: {
          id: user.discordId,
        },
        data: {
          premium: {
            ...user,
          },
        },
      });
    }
  }

  async getAllUsersLevel(): Promise<User[]> {
    const users = await this.database.findMany();
    return users.sort((a, b) => JSON.parse(JSON.stringify(b.levelData)).total - JSON.parse(JSON.stringify(a.levelData)).total);
  }
}
