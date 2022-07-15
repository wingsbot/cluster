import { User } from '../generated';

export interface UserPatronData {
  discordId: string;
  patronId: string;
  activeTiers: string[];
  hasPremium: boolean;
}

export interface UserLevelData {
  exp: number;
  level: number;
  total: number;
  percent: number;
  cooldown: number;
  usernameColor: string;
  bigSquareColor: string;
  bigSquareOpacity: number;
  levelColor: string;
  xpColor: string;
  rankColor: string;
  filledDotsColor: string;
  emptyDotsColor: string;
  backgroundURL: string;
  backgroundX: number;
  backgroundY: number;
  backgroundW: number;
  backgroundH: number;
}

export class UserData {
  id: string;
  balance: number;
  bank: number;
  bankCap: number;
  gangId?: string;
  premium: UserPatronData;
  levelData: UserLevelData;

  constructor(user: User) {
    this.id = user.id;
    this.balance = Number(user.balance);
    this.bank = Number(user.bank);
    this.bankCap = Number(user.bankCap);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.premium = user.premium as any || this.getDefaultPremium();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.levelData = user.levelData as any || this.getDefaultLevel();

    if (user.gangId) this.gangId = user.gangId;
  }

  private getDefaultPremium(): UserPatronData {
    return {
      discordId: this.id,
      patronId: null,
      activeTiers: [],
      hasPremium: false,
    };
  }

  private getDefaultLevel(): UserLevelData {
    return {
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
    };
  }
  // TODO: change balance, item management & more functions
}
