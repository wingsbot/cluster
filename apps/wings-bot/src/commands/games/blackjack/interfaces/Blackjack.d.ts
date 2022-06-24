export interface PlayerHand {
  doubledDown: boolean;
  splitted: boolean;
  handValue: number | 'blackjack';
  hand: Card[];
  hit: () => void;
  stand: () => void;
  doubleDown: () => void;
  split: () => void;
}

export interface DealerHand {
  handValue: number | 'blackjack';
  hand: Card[];
  hit: () => void;
  finish: () => void;
}

export interface Card {
  suit: string,
  rank: string,
  display: string;
  value: number;
  emoji: string;
}
