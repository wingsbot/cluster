import { EventBase } from '../../framework/bases/EventBase';

export default class Ready extends EventBase {
  async run() {
    console.log('Wings is ready!');
  }
}
