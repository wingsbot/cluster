export interface GameData {
  type: string;
  userId: string;
  messageLink: string;
  data?: RussianData;
}

export interface RussianData {
  price: number;
  pot: number;
  membersInGame: string[];
}
