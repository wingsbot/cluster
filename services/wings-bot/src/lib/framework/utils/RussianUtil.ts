import { EventEmitter } from 'node:events';
import { Shard } from '../../../Shard';
import { GameData } from '../../interfaces/Games';

export class RussianUtil extends EventEmitter {
  private readonly client: Shard;
  gameData: GameData;

  constructor(client: Shard, gameData: GameData) {
    super();
    this.gameData = gameData;
    this.client = client;
  }

  startGame() {
    this.emit('initiateGame', this.gameData);
  }

  startRound() {
    this.emit('startRound', this.gameData);
  }

  endGame() {
    this.removeAllListeners();

    if (!this.client.activeGames.has(`${this.gameData.guildId}:russian`)) return;
    this.client.activeGames.delete(`${this.gameData.guildId}:russian`);
  }

  refund() {
    for (const userId of this.gameData.data.membersInGame) {
      this.client.modules.economy.editBalance(userId, this.gameData.data.price);
    }
  }

  eliminate(userId: string) {
    const userIndex = this.gameData.data.membersInGame.indexOf(userId);

    this.gameData.data.membersInGame.splice(userIndex, 1);
  }

  addPlayer(userId: string) {
    this.client.modules.economy.editBalance(userId, -this.gameData.data.price);
    this.gameData.data.pot += this.gameData.data.price;
    this.gameData.data.membersInGame.push(userId);

    this.client.activeGames.set(`${this.gameData.guildId}:russian`, this.gameData);
    this.startGame();
  }

  removePlayer(userId: string) {
    this.client.modules.economy.editBalance(userId, this.gameData.data.price);
    this.gameData.data.pot += this.gameData.data.price;
    this.gameData.data.membersInGame.splice(this.gameData.data.membersInGame.indexOf(userId), 1);

    this.client.activeGames.set(`${this.gameData.guildId}:russian`, this.gameData);
  }
}
