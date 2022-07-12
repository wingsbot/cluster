import { EventEmitter } from 'node:events';
import { emojis, suits, ranks } from './constants';

export interface BlackjackData {
  playersHand: PlayersHand;
  dealersHand: DealersHand;
  allPlayersHands: PlayersHand[];
}

interface PlayersHand {
  handValue: number;
  cards: Card[];
  hit: () => void;
  stand: (data: BlackjackData) => void;
  doubleDown: (data: BlackjackData) => void;
  split: () => void;
}

interface DealersHand {
  handValue: number;
  cards: Card[];
  hit: () => void;
  finish: () => void;
}

interface Card {
  suit: string;
  rank: string;
  value: number;
  emoji: string;
}

type AnswerSelections = 'hit' | 'stand' | 'doubleDown' | 'split' | 'end';

export class BlackjackUtil extends EventEmitter {
  private deck: Card[];

  public startGame() {
    const info = this.getCards();

    this.emit('initiateGame', info);
  }

  public getHand() {
    return [this.deck.pop(), this.deck.pop()];
  }

  public endGame(data: BlackjackData) {
    this.emit('endGame', data);
  }

  public isSoft(hand: Card[]) {
    return hand.some(c => c.value === 11);
  }

  public cardValue(rank: string) {
    const index = ranks.indexOf(rank);

    if (index === 0) return 11;

    return index >= 10 ? 10 : index + 1;
  }

  public shuffle(array: Card[]) {
    let random: number;
    let temp: Card;
    const value = [...array];

    for (let i = 0; i < array.length; i++) {
      random = Math.floor(Math.random() * length--);
      temp = value[i];
      value[i] = value[random];
      value[random] = temp;
    }

    return value;
  }

  public getCards() {
    this.getDeck();

    const playersCards = this.getHand();
    const dealersCards = this.getHand();

    const playersHand = {
      handValue: playersCards.reduce((value, card) => value += card.value, 0),
      cards: playersCards,
      hit: () => {
        const newCard = this.deck.pop();
        playersHand.handValue += newCard.value;
        playersHand.cards.push(newCard);

        let ace = playersHand.cards.find(c => c.value === 11);

        while (playersHand.handValue > 21 && ace) {
          ace.value -= 10;
          playersHand.handValue -= 10;
          ace = playersHand.cards.find(c => c.value === 11);
        }
      },
      stand: (data: BlackjackData) => {
        this.endGame(data);
      },
      doubleDown: (data: BlackjackData) => {
        playersHand.hit();
        this.endGame(data);
      },
      split: () => {
        // something lol
      },
    };
    const dealersHand = {
      handValue: dealersCards.reduce((value, card) => value += card.value, 0),
      cards: dealersCards,
      hit: () => {
        const newCard = this.deck.pop();
        playersHand.handValue += newCard.value;
        playersHand.cards.push(newCard);

        let ace = playersHand.cards.find(c => c.value === 11);

        while (playersHand.handValue > 21 && ace) {
          ace.value -= 10;
          playersHand.handValue -= 10;
          ace = playersHand.cards.find(c => c.value === 11);
        }
      },
      finish: () => {
        if (this.isSoft(dealersHand.cards) || dealersHand.handValue < 17) {
          dealersHand.hit();
          dealersHand.finish();
        }
      },
    };

    return { allPlayersHands: [playersHand], playersHand, dealersHand };
  }

  private getDeck() {
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          suit,
          rank,
          value: this.cardValue(rank),
          emoji: emojis[`${rank}${suit}`],
        });
      }
    }

    this.deck = this.shuffle(deck);
  }

  public sendAnswer(answer: AnswerSelections, data: BlackjackData) {
    const { allPlayersHands } = data;
    let { playersHand } = data;

    switch (answer) {
    case 'hit':
      playersHand.hit();
      break;

    case 'stand':
      playersHand = allPlayersHands[allPlayersHands.length];

      if (!playersHand) {
        playersHand.stand(data);
      }

      break;

    case 'doubleDown':
      playersHand.doubleDown(data);
      break;

    case 'split':
      playersHand.split();
      // switch playersHand to current hand (newest hand).
      /*
          const nextHand = () => {
            playerDeck = hands[hands.indexOf(playerDeck) + 1];
          };
        */

      break;

    case 'end':
      this.emit('endGame', data);

      break;
    }
  }
}
