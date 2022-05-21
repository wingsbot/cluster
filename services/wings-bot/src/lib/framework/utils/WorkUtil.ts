import { Constants } from 'eris';
import { Shard } from '../../../Shard';
import { MessageComponent } from './MessageComponent';

export interface SimonSaysData {
  componentBase: MessageComponent;
  id: string;
  task: string;
  simonSelection: number[];
}

export interface PasscodeData {
  componentBase: MessageComponent;
  id: string;
  task: string;
  randomPasscode: number[];
}

export class WorkUtil {
  private readonly client: Shard;
  private readonly tasks: [() => SimonSaysData, () => PasscodeData];

  constructor(client: Shard) {
    this.client = client;
    this.tasks = [this.simonSays.bind(this), this.passcode.bind(this)];
  }

  public fetchRandomTask() {
    return this.tasks[Math.floor(Math.random() * this.tasks.length)]();
  }

  private simonSays(): SimonSaysData {
    const id = this.client.util.generateId();
    const componentBase = new MessageComponent()
      .addActionRow()
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square0:${id}`,
        disabled: true,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square1:${id}`,
        disabled: true,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square2:${id}`,
        disabled: true,
      })
      .addActionRow()
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square3:${id}`,
        disabled: true,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square4:${id}`,
        disabled: true,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square5:${id}`,
        disabled: true,
      })
      .addActionRow()
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square6:${id}`,
        disabled: true,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square7:${id}`,
        disabled: true,
      })
      .addButton({
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        emoji: { name: 'transparent', id: '908234959259570246' },
        custom_id: `square8:${id}`,
        disabled: true,
      });

    const simonSelection = this.randomIntArray(0, 8, 4);
    return { componentBase, task: 'simonSays', id, simonSelection };
  }

  private passcode(): PasscodeData {
    const id = this.client.util.generateId();
    const componentBase = new MessageComponent()
      .addActionRow()
      .addButton({
        label: '1',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `1:${id}`,
      })
      .addButton({
        label: '2',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `2:${id}`,
      })
      .addButton({
        label: '3',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `3:${id}`,
      })
      .addButton({
        label: '4',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `4:${id}`,
      })
      .addButton({
        label: '5',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `5:${id}`,
      })
      .addActionRow()
      .addButton({
        label: '6',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `6:${id}`,
      })
      .addButton({
        label: '7',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `7:${id}`,
      })
      .addButton({
        label: '8',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `8:${id}`,
      })
      .addButton({
        label: '9',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `9:${id}`,
      })
      .addButton({
        label: '0',
        type: Constants.ComponentTypes.BUTTON,
        style: Constants.ButtonStyles.SECONDARY,
        custom_id: `0:${id}`,
      });

    const randomPasscode = this.randomIntArray(0, 9, 4);
    return { componentBase, task: 'passcode', id, randomPasscode };
  }

  private randomIntArray(min: number, max: number, length: number) {
    const array = Array.from({ length });

    for (let i = 0; i < array.length; i++) {
      let randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      while (randomNumber === array[i - 1]) {
        randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
      }

      array[i] = randomNumber;
    }

    return array as number[];
  }
}
