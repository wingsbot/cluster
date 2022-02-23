import EventEmitter from 'node:events';
import { Shard } from '../../../Shard';
import type { GameData, BlackjackData, Hand } from '../../interfaces/Games';

const emojis = {
  AC: '<:AC:777051438634893312>', '2C': '<:2C:777634070867083336>', '3C': '<:3C:777051538027053086>',
  '4C': '<:4C:777051574740582400>', '5C': '<:5C:777051611242823702>', '6C': '<:6C:777051652564713492>',
  '7C': '<:7C:777051690083155968>', '8C': '<:8C:777051737998753803>', '9C': '<:9C:777051783561347082>',
  '10C': '<:10C:777051830244999168>', JC: '<:JC:777051917481672714>', QC: '<:QC:777051974658424862>',
  KC: '<:KC:777052027657388042>', AD: '<:AD:777095911137345557>', '2D': '<:2D:777095851741937694>',
  '3D': '<:3D:777095807610126337>', '4D': '<:4D:777095734382166016>', '5D': '<:5D:777095681340866568>',
  '6D': '<:6D:777095617171423252>', '7D': '<:7D:777095413488418826>', '8D': '<:8D:777095083371266058>',
  '9D': '<:9D:777095021743964192>', '10D': '<:10D:777094961568546827>', JD: '<:JD:777094843829583894>',
  QD: '<:QD:777094736837869588>', KD: '<:KD:777094674338545675>', AH: '<:AH:777634202749108234>',
  '2H': '<:2H:777634303769051136>', '3H': '<:3H:777634397629186089>', '4H': '<:4H:777634467346251788>',
  '5H': '<:5H:777634537264906260>', '6H': '<:6H:777634651862466650>', '7H': '<:7H:777634734300725289>',
  '8H': '<:8H:777634799128281088>', '9H': '<:9H:777634868288684092>', '10H': '<:10H:777634955232673792>',
  JH: '<:JH:777635026250367006>', QH: '<:QH:777635123935969280>', KH: '<:KH:777635184131833917>',
  AS: '<:AS:777048088254087208>', '2S': '<:2S:777633879904878592>', '3S': '<:3S:777048204465799171>',
  '4S': '<:4S:777048256999456813>', '5S': '<:5S:777048305544724502>', '6S': '<:6S:777048345095962645>',
  '7S': '<:7S:777048386070118410>', '8S': '<:8S:777048425820061717>', '9S': '<:9S:777048498671190037>',
  '10S': '<:10S:777048562294980608>', JS: '<:JS:777048629479211049>', QS: '<:QS:777048692796424213>',
  KS: '<:KS:777048752166404106>',
};
const ranks = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
const suits = ['C', 'D', 'H', 'S'];
// eslint-disable-next-line @typescript-eslint/no-unsafe-return
const decktemp = suits.map((suit: string) => ranks.concat(ranks)
  .concat(ranks)
  .concat(ranks)
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  .map((rank: string) => emojis[`${rank}${suit}`]))
  .reduce((array: string[], array_: string[]) => array.concat(array_));

export class BlackjackUtil extends EventEmitter {
  private readonly client: Shard;
  private readonly deck: string[];
  public gameData: GameData;

  constructor(client: Shard, gameData: GameData) {
    super();
    this.gameData = gameData;
    this.client = client;
    this.deck = this.shuffle(decktemp);
  }

  public startGame() {
    const info = this.getCards();

    this.emit('initiateGame', info);
  }

  public endGame() {
    this.removeAllListeners();

    if (!this.client.activeGames.has(`${this.gameData.userId}:blackjack`)) return;
    this.client.activeGames.delete(`${this.gameData.userId}:blackjack`);
  }

  public hit(hand: string[]) {
    hand.push(this.deck.pop());
    return hand;
  }

  public cardValue(card: string) {
    const index = ranks.indexOf(card.slice(2, -21));

    if (index === 0) return 11;

    return index >= 10 ? 10 : index + 1;
  }

  // checks if the current hand has an ace (11 or 1)
  public isSoft(deck: Hand) {
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
  public handValue(deck: Hand) {
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

  public gameResult(playerValue: number | 'blackjack', dealerValue: number | 'blackjack') {
    if (playerValue > 21) return 'bust';
    if (dealerValue > 21) return 'dealer bust';
    if (playerValue === dealerValue) return 'push';
    if (playerValue === 'blackjack' || playerValue > dealerValue) return 'win';

    return 'loss';
  }

  // draws 2 cards from the deck
  private getHand() {
    return this.hit(this.hit([]));
  }

  private getCards() {
    const playerDeck = {
      doubled: false,
      hand: this.getHand(),
    };
    const opponentDeck = {
      doubled: false,
      hand: this.getHand(),
    };
    // hands is for splitting. When user splits there will be arrays of playerDeck in the hands
    const hands = [{ ...playerDeck }];

    return { hands, playerDeck, opponentDeck };
  }

  private shuffle(array: string[]) {
    let random: number;
    let temporary: string;
    let length = array.length;
    const value = array.slice();

    while (length) {
      random = Math.floor(Math.random() * length--);
      temporary = value[length];
      value[length] = value[random];
      value[random] = temporary;
    }

    return value;
  }

  public sendAnswer(selection: string, cards: BlackjackData) {
    const { hands, playerDeck } = cards;

    const nextHand = () => {
      playerDeck.hand = hands[hands.length - 1].hand;
    };

    switch (selection) {
      case 'hit': {
        this.hit(playerDeck.hand);
        this.emit('runHands', cards);
        break;
      }

      case 'stand': {
        if (!this.client.util.arraysEqual(playerDeck.hand, hands[hands.length - 1].hand)) nextHand();

        this.emit('runHands', cards);
        break;
      }

      case 'split': {
        this.hit(playerDeck.hand);
        this.emit('runHands', cards);
        break;
      }

      case 'doubleDown': {
        this.hit(playerDeck.hand);
        this.emit('endGame', cards);
        break;
      }

      case 'nextHand': {
        nextHand();

        this.emit('runHands', cards);
        break;
      }

      default: {
        this.emit('endGame', cards);
        break;
      }
    }
  }
}
