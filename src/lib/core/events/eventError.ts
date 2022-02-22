import { EventBase } from '../../framework/bases/EventBase';

export default class EventError extends EventBase {
  async run(error: any) {
    console.log(error);
  }
}
