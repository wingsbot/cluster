import type { Responder } from '../../core';
import type { Shard } from '../../../Shard';
import type { CommandBase } from '../bases/CommandBase';

export class CooldownGuard {
  readonly client: Shard;
  readonly responder: Responder;
  readonly cooldown: number;
  readonly identifier: string;
  readonly name: string;

  constructor(client: Shard, responder: Responder, command: CommandBase) {
    this.client = client;
    this.responder = responder;
    this.name = command.name;
    this.cooldown = command.cooldown;
    this.identifier = `${responder.interaction.member.id}:${command.name}`;
  }

  public async getCooldown() {
    if (!await this.client.redis.exists(this.identifier)) return null;
    const timeInMs = await this.client.redis.pttl(this.identifier);
    const timeLeft = this.client.util.msDuration(timeInMs) || '1 Second';
    return timeLeft;
  }

  get exists() {
    return this.client.redis.exists(this.identifier);
  }

  public setCooldown() {
    this.client.redis.set(this.identifier, 'true', 'PX', this.cooldown);
  }

  public async handleMessage() {
    const onCooldown = await this.getCooldown();

    this.responder.send(`You must wait \`${onCooldown}\` to do \`/${this.name}\` again!`, true);
  }
}
