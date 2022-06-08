import { ApplicationCommandOptions, Constants } from 'eris';
import { inspect } from 'node:util';
import { request } from 'undici';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Eval extends CommandBase {
  description = 'yuh owner time';
  ownerOnly = true;
  options: ApplicationCommandOptions[] = [{
    name: 'message',
    description: 'code input',
    type: Constants.ApplicationCommandOptionTypes.STRING,
    required: true,
  }];

  private censorOutput(output: string) {
    const toCensor = [this.client.config.token];

    for (const censor of toCensor) {
      output = output.replace(new RegExp(censor, 'g'), '-- snip --');
    }

    return output;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  exec = async ({ interaction, responder, options }: CommandData) => {
    try {
      const userResponse = options[0].value as string;
      let output: string = await eval(`(async () => {${userResponse}})()`);
      output = this.censorOutput(inspect(output));

      if (output && output.length >= 1900) {
        const response = await request('https://hastebin.com/documents', {
          method: 'POST',
          body: `output=${output}`,
        });
        const body = await response.body.json();
        const url = `https://hastebin.com/${body.key}.js`;
        responder.send(`Output too large: ${url}`);
        return;
      }

      responder.send(`\`\`\`js\n${output}\`\`\``);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      responder.send(`**Error:**\n\`\`\`js\n${error.toString()}\`\`\``);
    }
  };
}
