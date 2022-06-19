export interface GameData {
  id: string;
  type: string;
  userId: string;
  messageLink: string;
  data?: RussianData;
}

export interface BlackjackData {
  hands: Hand[];
  playerDeck: Hand;
  opponentDeck: Hand;
}

export interface Hand {
  doubleDown: boolean;
  split: boolean;
  hand: string[];
  hit: () => string;
  stand: () => any;
}

export interface RussianData {
  price: number;
  pot: number;
  membersInGame: string[];
}
