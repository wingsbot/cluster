export interface GameData {
  id: string;
  type: string;
  userId: string;
  guildId: string;
  channelId: string;
  messageId: string;
  messageLink: string;
  data?: RussianData;
}

export interface BlackjackData {
  hands: Hand[];
  playerDeck: Hand;
  opponentDeck: Hand;
}

export interface Hand {
  doubled: boolean;
  hand: string[];
}

export interface RussianData {
  price: number;
  pot: number;
  membersInGame: string[];
}
