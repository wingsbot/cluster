import type { GameData, BlackjackData, Hand } from '../../../lib/interfaces/Games';
import { ranks, suits, emojis } from './constants';
import type { Client } from '../../..';

export class BlackjackUtil {
  private readonly deck: string[];
  private readonly cards: string[];

  constructor(private client: Client, public gameData: GameData) {
    this.gameData = gameData;
    this.client = client;
    this.cards = suits.map((suit: string) => ranks.concat(ranks)
      .concat(ranks)
      .concat(ranks)
      .map((rank: string) => emojis[`${rank}${suit}`]))
      .reduce((array: string[], array_: string[]) => array.concat(array_));
    this.deck = this.shuffle();
  }

  startGame() {
    const info = this.getCards();
  }

  endGame() {
    if (!this.client.activeGames.has(`${this.gameData.userId}:blackjack`)) return;
    this.client.activeGames.delete(`${this.gameData.userId}:blackjack`);
  }

  hit() {
    return this.deck.pop();
  }

  cardValue(card: string) {
    const index = ranks.indexOf(card.slice(2, -21));

    if (index === 0) return 11;

    return index >= 10 ? 10 : index + 1;
  }

  // checks if the current hand has an ace (11 or 1)
  isSoft(deck: Hand) {
    let value = 0;
    let aces = 0;

    for (const card of deck.hand) {
      value += this.cardValue(card);
      if (this.cardValue(card) === 11) aces++;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    if (value === 21 && deck.hand.length === 2) return false;

    return aces !== 0;
  }

  // gets the value from the hand array
  handValue(deck: Hand) {
    let value = 0;
    let aces = 0;

    for (const card of deck.hand) {
      value += this.cardValue(card);
      if (this.cardValue(card) === 11) aces++;
    }

    while (value > 21 && aces > 0) {
      value -= 10;
      aces--;
    }

    if (value === 21 && deck.hand.length === 2) return 'blackjack';

    return value;
  }

  gameResult(playerValue: number | 'blackjack', dealerValue: number | 'blackjack') {
    if (playerValue > 21) return 'bust';
    if (dealerValue > 21) return 'dealer bust';
    if (playerValue === dealerValue) return 'push';
    if (playerValue === 'blackjack' || playerValue > dealerValue) return 'win';

    return 'loss';
  }

  // draws 2 cards from the deck
  private getHand() {
    return [this.hit(), this.hit()];
  }

  private getCards() {
    const playerDeck = {
      doubleDown: false,
      split: false,
      hand: this.getHand(),
      hit: () => this.hit(),
    };
    const opponentDeck = {
      doubleDown: false,
      split: false,
      hand: this.getHand(),
    };
    // hands is for splitting. When user splits there will be arrays of playerDeck in the hands
    const playersHands = [{ ...playerDeck }];

    return { playersHands, playerDeck, opponentDeck };
  }

  private shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i);
      const temp = this.deck[i];
      this.deck[i] = this.deck[j];
      this.deck[j] = temp;
    }
  }

  sendAnswer(selection: string, cards: BlackjackData) {
    const { hands, playerDeck } = cards;

    const nextHand = () => {
      playerDeck.hand = hands[hands.length - 1].hand;
      playerDeck.hit();
    };

    switch (selection) {
    case 'hit': {
      this.hit(playerDeck.hand);
      this.emit('runHands', cards);
      break;
    }

    case 'stand': {
      if (!this.client.util.arraysEqual(playerDeck.hand, hands[hands.length - 1].hand)) nextHand();

      break;
    }

    case 'split': {
      this.hit(playerDeck.hand);
      break;
    }

    case 'doubleDown': {
      this.hit(playerDeck.hand);
      break;
    }

    case 'nextHand': {
      nextHand();

      break;
    }

    default: {
      break;
    }
    }
  }
}
