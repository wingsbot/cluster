import { freemem, totalmem } from 'node:os';
import { Command, CommandData } from '../../structures';

export class StatsCommand extends Command {
  description = 'get the bot statistics';
  ownerOnly = true;
  guildOnly = true;

  async run({ interaction }: CommandData<StatsCommand>) {
    interaction.sendEmbed({
      title: 'Wings Statistics',
      fields: [
        {
          name: 'Command Count',
          value: this.client.commands.size.toLocaleString(),
          inline: true,
        },
        {
          name: 'Memory Usage',
          value: `${this.client.utils.prettyBytes(freemem())}/${this.client.utils.prettyBytes(totalmem())}`,
          inline: true,
        },
        {
          name: 'Uptime',
          value: `${this.client.utils.msDuration(process.uptime() * 1000) || '1 Second'}`,
        }],
    });
  }
}
