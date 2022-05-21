import { TextChannel, VERSION } from 'eris';
import { freemem, totalmem } from 'node:os';
import { CommandBase, CommandData } from '../../lib/framework';

export default class Status extends CommandBase {
  public description = 'get the bot statistics';
  public ownerOnly = true;
  public guildOnly = true;

  public exec = async ({ interaction, responder }: CommandData) => {
    const botStats = await this.client.ipc.getBotStats();
    const channel = interaction.channel as TextChannel;

    responder.sendEmbed({
      title: 'Wings Statistics',
      fields: [{
        name: 'Guilds',
        value: botStats.guilds.toLocaleString(),
        inline: true,
      },
      {
        name: 'Channels',
        value: botStats.channels.toLocaleString(),
        inline: true,
      },
      {
        name: 'Users',
        value: botStats.users.toLocaleString(),
        inline: true,
      },
      {
        name: 'Library',
        value: `Eris V${VERSION}`,
        inline: true,
      },
      {
        name: 'Shards',
        value: this.client.totalShards.toLocaleString(),
        inline: true,
      },
      {
        name: 'Command Count',
        value: this.client.commands.size.toLocaleString(),
        inline: true,
      },
      {
        name: 'Memory Usage',
        value: `${this.client.util.prettyBytes(freemem())}/${this.client.util.prettyBytes(totalmem())}`,
        inline: true,
      },
      {
        name: 'Voice Channels',
        value: botStats.voiceConnections.toLocaleString(),
        inline: true,
      },
      {
        name: 'Uptime',
        value: `${this.client.util.msDuration(process.uptime() * 1000) || '1 Second'}`,
      }],
      footer: {
        text: `Cluster: ${this.client.clusterId} | Shard: ${channel.guild.shard.id}`,
      },
    });
  };
}
