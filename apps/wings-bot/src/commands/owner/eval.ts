import { inspect } from 'node:util';
import { request } from 'undici';
import { Args, Command, CommandOptions, CommandData } from '../../structures';

export class EvalCommand extends Command {
  description = 'yuh owner time';
  ownerOnly = true;
  options = new CommandOptions()
    .addOption(Args.string('code', 'The code to evaluate', { required: true }));

  private censorOutput(output: string) {
    const toCensor = [this.client.config.botToken];

    for (const censor of toCensor) {
      output = output.replace(new RegExp(censor, 'g'), '-- snip --');
    }

    return output;
  }

  async run({ interaction, options }: CommandData<EvalCommand>) {
    try {
      const userResponse = options.get('code');
      let output: string = await eval(`(async () => {${userResponse}})()`);
      output = this.censorOutput(inspect(output));

      if (output && output.length >= 1900) {
        const response = await request('https://hastebin.com/documents', {
          method: 'POST',
          body: `output=${output}`,
        });
        const body = await response.body.json();
        const url = `https://hastebin.com/${body.key}.js`;
        interaction.send(`Output too large: ${url}`);
        return;
      }

      interaction.send(`\`\`\`js\n${output}\`\`\``);
    } catch (error: unknown) {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      interaction.send(`**Error:**\n\`\`\`js\n${error.toString()}\`\`\``);
    }
  }
}
