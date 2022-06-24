import { ranks, suits, emojis } from './constants';
import { Card, DealerHand, PlayerHand } from './interfaces/Blackjack';

export class BlackjackUtil {
  public ended = false;

  get deck(): Card[] {
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        const card = `${suit}${rank}`;

        deck.push({
          suit,
          rank,
          display: card,
          value: this.cardValue(card),
          emoji: emojis[card],
        });
      }
    }

    this.shuffle(deck);

    return deck;
  }

  initiate() {
    const playersHand: PlayerHand = {
      doubledDown: false,
      splitted: false,
      handValue: 0,
      hand: [this.deck.pop(), this.deck.pop()],
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
      handValue: 0,
      hand: [this.deck.pop(), this.deck.pop()],
      hit: () => {
        const card = this.deck.pop();
        if (playersHand.hand.some(c => c.value === 11) && playersHand.handValue > 21) playersHand.hand.find(c => c.value === 11).value = 1;

        (playersHand.handValue as number) += card.value;
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


  cardValue(card: string) {
    const index = ranks.indexOf(card.slice(2, -21));

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
      const temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }
  }
}
