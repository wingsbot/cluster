import type { CommandInteraction, ComponentInteraction } from 'eris';
import type { AwaitComponentReturn } from '../../framework/InteractionHandler';
import type { Units } from '../../interfaces/Utility.d';
import { InteractionTimeoutError } from '../../framework/errors/InteractionTimeoutError';

import type { Shard } from '../../../Shard';

import { Responder } from './Responder';

interface AwaitOptions {
  time?: number;
  strict?: boolean;
}

// <t:${Math.floor(new Date() / 1000)}:R> <- got a unix timestamp from
export class ClientUtil {
  private readonly client: Shard;
  readonly units: Units;

  constructor(client: Shard) {
    this.client = client;
  }

  public msDuration(milliseconds: number, verbose = true, ms = false): string {
    const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

    const parsed = {
      days: roundTowardsZero(milliseconds / 86400000),
      hours: roundTowardsZero(milliseconds / 3600000) % 24,
      minutes: roundTowardsZero(milliseconds / 60000) % 60,
      seconds: roundTowardsZero(milliseconds / 1000) % 60,
    };

    const durations = [
      ['year', 'y', Math.trunc(parsed.days / 365)],
      ['month', 'mth', Math.trunc((parsed.days % 365) / 28)],
      ['week', 'w', Math.trunc(((parsed.days % 365) % 28) / 7)],
      ['day', 'd', ((parsed.days % 365) % 28) % 7],
      ['hour', 'h', parsed.hours],
      ['minute', 'm', parsed.minutes],
      ['second', 's', parsed.seconds],
    ];

    if (ms) durations.push(['millisecond', 'ms', milliseconds % 1000]);

    const units: string[] = [];
    for (let [unit, short, amount] of durations) {
      if (amount === 0) continue;
      if (verbose) unit = amount === 1 ? unit : `${unit}s`;
      units.push(`${amount}${verbose ? ` ${unit}` : short}`);
    }

    if (verbose) {
      const last = units.pop();
      return units.length > 0 ? `${units.join(' ')} and ${last}` : last;
    }

    return units.join(', ');
  }

  public deepEquals(object1: any, object2: any, ignoreList = []) {
    return (
      typeof object1 === typeof object2
      && Array.isArray(object1) === Array.isArray(object2)
      && (typeof object1 === 'object'
        ? (Array.isArray(object1)
          ? object1.length === object2.length && object1.every((a, i) => this.deepEquals(a, object2[i], ignoreList))
          : Object.keys(object1).every(key =>
            ignoreList.includes(key)
            || (key in object2 && this.deepEquals(object1[key], object2[key], ignoreList)),
          )
        )
        : object1 === object2)
    );
  }

  public getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  public randomIntArray(min: number, max: number, length: number): number[] {
    const array = Array.from({ length });

    for (let i = 0; i < array.length; i++) {
      const randomNumber = this.getRandomInt(min, max);
      array[i] = randomNumber;
    }

    return array as number[];
  }

  public generateId() {
    return [...Array.from({ length: 10 })].map(() => (~~(Math.random() * 36)).toString(36)).join('');
  }

  public arraysEqual(array1: any, array2: any) {
    if (array1 === array2) return true;
    if (array1 === null || array2 === null) return false;
    if (array1.length !== array2.length) return false;

    // eslint-disable-next-line unicorn/no-for-loop
    for (let i = 0; i < array1.length; ++i) {
      if (array1[i] !== array2[i]) return false;
    }

    return true;
  }

  public prettyBytes(number: number) {
    const UNITS = ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    if (!Number.isFinite(number)) {
      throw new TypeError(`Expected a finite number, got ${typeof number}: ${number}`);
    }

    const neg = number < 0;

    if (neg) number = -number;
    if (number < 1) return (neg ? '-' : '') + number + ' B';

    const exponent = Math.min(Math.floor(Math.log(number) / Math.log(1000)), UNITS.length - 1);
    const numberString = Number(number / (1000 ** exponent)).toPrecision(3);
    const unit = UNITS[exponent];

    return (neg ? '-' : '') + numberString + ' ' + unit;
  }

  public async awaitComponent(interaction: CommandInteraction, responder: Responder, id: string, options: AwaitOptions = {}): Promise<ComponentInteraction & AwaitComponentReturn> {
    if (!options.time) options.time = 1000 * 60;
    if (options.strict) {
      const message = await interaction.getOriginalMessage();

      this.client.interactionHandler.activeAwaits.set(interaction.member.id, message.jumpLink);
    }

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.client.interactionHandler.awaits.delete(id);
        if (options.strict) this.client.interactionHandler.activeAwaits.delete(interaction.member.id);

        reject(new InteractionTimeoutError('Prompt timed out!'));
      }, options.time);

      this.client.interactionHandler.awaits.set(id, { strict: options.strict, timeout, resolve, interaction, responder });
    });
  }

  public async awaitGlobalComponent(interaction: CommandInteraction, responder: Responder, id: string, time = 60000): Promise<ComponentInteraction & AwaitComponentReturn> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.client.interactionHandler.awaits.delete(id);

        reject(new InteractionTimeoutError('Prompt timed out!'));
      }, time);

      this.client.interactionHandler.awaits.set(id, { global: true, timeout, resolve, interaction, responder });
    });
  }
}
