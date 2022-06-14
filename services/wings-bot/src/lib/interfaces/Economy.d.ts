export interface UserData {
  id: string;
  balance: number;
  bank: number;
  bankCap: number;
  gangId?: string;
  premium: {
    discordId: string;
    patronId: string;
    activeTiers: string[];
    hasPremium: boolean;
  }
  levelData: {
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
}

export interface TopTenUser {
  id: string;
  summed: number;
}

export interface Gang {
  id?: string;
  name: string;
  members: string[];
  balance: number;
}
