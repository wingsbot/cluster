import type { User, PrismaClient } from '@prisma/client';
import type { UserLevelData } from '../../../apps/wings-bot/src/lib/interfaces/Levels';
import { UserPatronData } from '../structures/UserData';

export class UserDatabase {
  constructor(private client: PrismaClient, private database: PrismaClient['user']) {}

  async getUser(userId: string) {
    let userData = await this.database.findUnique({
      where: {
        id: userId,
      },
    });
    console.log(userData);
    if (!userData) userData = await this.getDefaultUserData(userId, {});
    return userData;
  }

  private async getDefaultUserData(id: string, { balance = 0, bank = 0, bankCap = 15_000, gangId = null }) {
    const user = await this.database.create({
      data: {
        id,
        balance: BigInt(balance),
        bank: BigInt(bank),
        bankCap: BigInt(bankCap),
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
      },
    });

    return user;
  }

  async editUserBalance(userId: string, balance: number) {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          balance: {
            increment: BigInt(balance),
          },
        },
      });
    } catch {
      userData = await this.getDefaultUserData(userId, { balance });
    }

    return userData;
  }

  async editUserBank(userId: string, bank: number) {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          bank: {
            increment: BigInt(bank),
          },
        },
      });
    } catch {
      userData = await this.getDefaultUserData(userId, { bank });
    }

    return userData;
  }

  async editUserBankCap(userId: string, bankCap: number) {
    let userData: User;

    try {
      userData = await this.database.update({
        where: {
          id: userId,
        },
        data: {
          bankCap: {
            increment: BigInt(bankCap),
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

  async updateLevel(userId: string, levelObject: UserLevelData) {
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

  async updatePremium(premiumObject: UserPatronData[]) { // TODO: change this to sql query instead (more efficient probably)
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
