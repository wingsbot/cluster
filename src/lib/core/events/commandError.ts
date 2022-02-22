import { EventBase } from '../../framework/bases/EventBase';
import { CommandError } from '../../interfaces/Events.d';

export default class Ready extends EventBase {
  async run({ command, responder, error }: CommandError) {
    responder.sendEmbed({
      title: `Error! (Command: ${command.name})`,
      description: error.message,
    });
  }
}
