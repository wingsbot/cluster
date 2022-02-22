export interface UserLevelData {
  _id?: string;
  userId: string;
  exp: number;
  level: number;
  total: number;
  percent: number;
  cooldown: number;
  levelPicture: UserLevelPicture;
}

export interface UserLevelPicture {
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
