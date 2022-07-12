import { APIUser, Routes } from 'discord-api-types/v10';
import type { Client } from '../../../Client';
import { User } from '../../../structures';
import type { Units } from '../../interfaces/Utility';

export class ClientUtil {
  readonly units: Units;

  emojis = {
    check: '<a:check:771153653091401738>',
    xmark: '<a:xmark:769512912808443924>',
    loading: '<a:loading:769061423732883466>',
  };

  colors = {
    green: 7_593_264,
    red: 16_736_352,
    blue: 2_527_999,
    default: 0xFF_16_00,
  };

  constructor(private client: Client) {}

  async fetchUser(userId: string): Promise<User> {
    try {
      const user = await this.client.restClient.get(Routes.user(userId)) as APIUser;
      return new User(user);
    } catch {
      return null;
    }
  }

  msDuration(milliseconds: number, verbose = true, ms = false): string {
    const roundTowardsZero = milliseconds > 0 ? Math.floor : Math.ceil;

    const parsed = {
      days: roundTowardsZero(milliseconds / 86_400_000),
      hours: roundTowardsZero(milliseconds / 3_600_000) % 24,
      minutes: roundTowardsZero(milliseconds / 60_000) % 60,
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
    for (const [unit, short, amount] of durations) {
      if (amount === 0) continue;
      let newUnit = unit;
      if (verbose) newUnit = amount === 1 ? unit : `${unit}s`;
      units.push(`${amount}${verbose ? ` ${newUnit}` : short}`);
    }

    if (verbose) {
      const last = units.pop();
      return units.length > 0 ? `${units.join(' ')} and ${last}` : last;
    }

    return units.join(', ');
  }

  deepEquals(object1: any, object2: any, ignoreList = []) {
    return (
      typeof object1 === typeof object2
      && Array.isArray(object1) === Array.isArray(object2)
      && (typeof object1 === 'object'
        ? (Array.isArray(object1)
          ? object1.length === object2.length && object1.every((a, index) => this.deepEquals(a, object2[index], ignoreList))
          : Object.keys(object1).every(key =>
            ignoreList.includes(key)
            || (key in object2 && this.deepEquals(object1[key], object2[key], ignoreList)),
          )
        )
        : object1 === object2)
    );
  }

  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  randomIntArray(min: number, max: number, length: number): number[] {
    const array = Array.from({ length });

    for (let index = 0; index < array.length; index++) {
      const randomNumber = this.getRandomInt(min, max);
      array[index] = randomNumber;
    }

    return array as number[];
  }

  generateId() {
    return [...Array.from({ length: 10 })].map(() => (~~(Math.random() * 36)).toString(36)).join('');
  }

  arraysEqual(array1: any, array2: any) {
    if (array1 === array2) return true;
    if (array1 === null || array2 === null) return false;
    if (array1.length !== array2.length) return false;

    // eslint-disable-next-line unicorn/no-for-loop
    for (let index = 0; index < array1.length; ++index) {
      if (array1[index] !== array2[index]) return false;
    }

    return true;
  }

  prettyBytes(number: number) {
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
}
