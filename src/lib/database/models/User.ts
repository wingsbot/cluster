import { User, PrismaClient, Prisma } from '@prisma/client';

export class UserDatabase {
  readonly client: PrismaClient;
  readonly database: PrismaClient['user'];

  constructor(client: PrismaClient, user: PrismaClient['user']) {
    this.client = client;
    this.database = user;
  }

  async getUser(userId: string): Promise<User> {
    const userData = await this.database.findUnique({
      where: {
        id: userId,
      },
    });

    if (!userData) return this.getDefaultUserData(userId, {});

    return userData;
  }

  private getDefaultUserData(id: string, { balance = 0n, bank = 0n, bankCap = 0n, gangId = undefined }): User {
    return {
      id,
      balance,
      bank,
      bankCap,
      gangId,
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
  }

  async editUserBalance(userId: string, balance: bigint): Promise<User> {
    const userData = await this.database.update({
      where: {
        id: userId,
      },
      data: {
        balance,
      },
    });

    if (!userData) return this.getDefaultUserData(userId, { balance });

    return userData;
  }

  async editUserBank(userId: string, bank: bigint): Promise<User> {
    const userData = await this.database.update({
      where: {
        id: userId,
      },
      data: {
        bank,
      },
    });

    if (!userData) return this.getDefaultUserData(userId, { bank });

    return userData;
  }

  async editUserBankCap(userId: string, bankCap: bigint): Promise<User> {
    const userData = await this.database.update({
      where: {
        id: userId,
      },
      data: {
        bankCap,
      },
    });

    if (!userData) return this.getDefaultUserData(userId, { bankCap });

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

  async getTopTen(): Promise<User[]> {
    return this.client.$queryRawUnsafe('SELECT CONVERT(balance, UNSIGNED INTEGER) + CONVERT(bank, UNSIGNED INTEGER) as summed,id FROM economy ORDER BY summed DESC LIMIT 10;');
  }

  async updateLevel(userId: string, levelData: Prisma.JsonValue): Promise<User> {
    return this.database.update({
      where: {
        id: userId,
      },
      data: {
        levelData,
      },
    });
  }
}
