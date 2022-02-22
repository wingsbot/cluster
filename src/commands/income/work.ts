import { Constants, InteractionButton } from 'eris';
import { AwaitComponentReturn, CommandBase, CommandData, InteractionTimeoutError } from '../../lib/framework';
import { SimonSaysData, WorkUtil } from '../../lib/framework/utils';

// eslint-disable-next-line no-promise-executor-return
const sleep = async (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export default class Work extends CommandBase {
  public description = 'You look poor, work and get some Wings';

  public exec = async ({ interaction, responder, cooldown }: CommandData) => {
    const workUtil = new WorkUtil(this.client);
    const workTask = workUtil.fetchRandomTask();

    switch (workTask.task) {
      case 'simonSays': {
        const task = workTask as SimonSaysData;
        responder.sendRaw({ content: 'Select them in order.', components: task.componentBase.components });

        for (const number of task.simonSelection) {
          await sleep(2000);
          for (const row of task.componentBase.components) {
            const buttons = row.components as InteractionButton[];
            const button = buttons.find((c: InteractionButton) => c.custom_id === `square${number}:${task.id}`);

            if (!button) continue;
            button.style = Constants.ButtonStyles.DANGER;

            responder.editRaw({ content: 'Select them in order.', components: task.componentBase.components });
            button.style = Constants.ButtonStyles.SECONDARY;
          }
        }

        await sleep(2000);
        task.componentBase.enableAllComponents();
        responder.editRaw({ content: 'Select them in order.', components: task.componentBase.components });

        await this.runSimonSays(task, responder, interaction);
        break;
      }

      case 'passcode': {
        break;
      }

      default: {
        break;
      }
    }
  };

  private async runSimonSays(task: SimonSaysData, responder: CommandData['responder'], interaction: CommandData['interaction'], _i = 1) {
    if (task.simonSelection.length === 0) {
      responder.success('You win!');
      return;
    }

    let response: AwaitComponentReturn;
    try {
      response = await this.client.util.awaitComponent(interaction, responder, task.id);
    } catch (error) {
      if (error instanceof InteractionTimeoutError) {
        task.componentBase.disableAllComponents();

        responder.editRaw({
          content: '',
          embeds: [{
            description: 'You ran out of time :(',
          }],
          components: [],
        });

        return;
      }
    }

    const number = task.simonSelection.shift();

    if (response.parsedId !== `square${number}`) {
      task.componentBase.disableAllComponents();
      response.responder.editRaw({ content: `Select them in order. ${_i}/4`, components: task.componentBase.components });

      responder.error('You were incorrect!');
      return;
    }

    for (const row of task.componentBase.components) {
      const buttons = row.components as InteractionButton[];
      const button = buttons.find((c: InteractionButton) => c.custom_id === `square${number}:${task.id}`);

      if (!button) continue;
      button.style = Constants.ButtonStyles.SUCCESS;

      if (task.simonSelection.length === 0) task.componentBase.disableAllComponents();
      response.responder.editRaw({ content: `Select them in order. ${_i}/4`, components: task.componentBase.components });
      button.style = Constants.ButtonStyles.SECONDARY;
    }

    this.runSimonSays(task, responder, interaction, _i += 1);
  }
}
