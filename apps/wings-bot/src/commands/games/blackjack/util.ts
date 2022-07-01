import { ranks, suits, emojis } from './constants';

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

export class BlackjackUtil {
  public ended = false;
  private deck: Card[];

  getDeck(): Card[] {
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        const card = `${rank}${suit}`;

        deck.push({
          suit,
          rank,
          display: card,
          value: this.cardValue(rank),
          emoji: emojis[card],
        });
      }
    }

    const shuffled = this.shuffle(deck);

    return shuffled;
  }

  initiate() {
    this.deck = this.getDeck();
    const playerCards = [this.deck.pop(), this.deck.pop()];
    const dealersCards = [this.deck.pop(), this.deck.pop()];

    const playersHand: PlayerHand = {
      doubledDown: false,
      splitted: false,
      handValue: playerCards.reduce((value, currentCard) =>  value += currentCard.value, 0),
      hand: playerCards,
      hit: () => {
        const card = this.deck.pop();
        if (playersHand.hand.some(c => c.value === 11) && playersHand.handValue > 21) playersHand.hand.find(c => c.value === 11).value = 1;

        (playersHand.handValue as number) += card.value;
        playersHand.hand.push(card);
      },
      stand: () => this.end(),
      doubleDown: () => {
        playersHand.hit();
        playersHand.doubledDown = true;
      },
      split: () => {
        playersHand.hit();
      },
    };

    const dealersHand: DealerHand = {
      handValue: dealersCards.reduce((value, currentCard) =>  value += currentCard.value, 0),
      hand: dealersCards,
      hit: () => {
        const card = this.deck.pop();
        if (dealersHand.hand.some(c => c.value === 11) && playersHand.handValue > 21) playersHand.hand.find(c => c.value === 11).value = 1;

        (dealersHand.handValue as number) += card.value;
        dealersHand.hand.push(card);
      },
      finish: () => {
        if (this.isSoft(dealersHand.hand) || dealersHand.handValue < 17) {
          dealersHand.hit();
          dealersHand.finish();
        }
      },
    };

    // playersHands is for when splitting happens
    return { playersHands: [playersHand], playersHand, dealersHand };
  }

  end() {
    this.ended = true;
  }

  cardValue(rank: string) {
    const index = ranks.indexOf(rank);

    if (index === 0) return 11;

    return index >= 10 ? 10 : index + 1;
  }

  // checks if the current hand has an ace (11 or 1)
  isSoft(hand: Card[]) {
    return hand.some((card) => card.rank === 'A' && card.value === 11);
  }

  result(playerValue: number | 'blackjack', dealerValue: number | 'blackjack') {
    if (playerValue > 21) return 'bust';
    if (dealerValue > 21) return 'dealer bust';
    if (playerValue === dealerValue) return 'push';
    if (playerValue === 'blackjack' || playerValue > dealerValue) return 'win';

    return 'loss';
  }

  private shuffle(deck: Card[]) {
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
    }

    return deck;
  }
}
