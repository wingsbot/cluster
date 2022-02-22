import { EmbedOptions, ApplicationCommandOptionChoice, InteractionContent, FileContent, CommandInteraction, AutocompleteInteraction, ComponentInteraction, Constants } from 'eris';
import type { AwaitComponentReturn } from '../../framework/InteractionHandler';
import { InteractionTimeoutError } from '../../framework/errors/InteractionTimeoutError';
import type { Shard } from '../../../Shard';

export class Responder {
  readonly client: Shard;
  public interaction: CommandInteraction | ComponentInteraction | AutocompleteInteraction;

  public emojis = {
    check: '<a:check:771153653091401738>',
    xmark: '<a:xmark:769512912808443924>',
    loading: '<a:loading:769061423732883466>',
  };

  public colors = {
    green: 7593264,
    red: 16736352,
    blue: 2527999,
    default: 0xFF1600,
  };

  constructor(client: Shard, interaction: CommandInteraction | ComponentInteraction | AutocompleteInteraction) {
    this.client = client;
    this.interaction = interaction;
  }

  public async send(content: string, ephermal = false) {
    const interaction = this.interaction as CommandInteraction | ComponentInteraction;

    if (interaction.acknowledged) return interaction.createFollowup({ content, flags: ephermal ? Constants.MessageFlags.EPHEMERAL : null });
    return interaction.createMessage({ content, flags: ephermal ? Constants.MessageFlags.EPHEMERAL : null });
  }

  public async edit(content: string, messageId?: string) {
    const interaction = this.interaction as CommandInteraction | ComponentInteraction;

    if (interaction instanceof ComponentInteraction) {
      if (!messageId) return interaction.editParent({ content });
      return interaction.editMessage(messageId, content);
    }

    if (!messageId) return interaction.editOriginalMessage(content);
    return interaction.editMessage(messageId, content);
  }

  public async sendEmbed(embed: EmbedOptions, content = '', ephermal = false) {
    const interaction = this.interaction as CommandInteraction | ComponentInteraction;

    if (!embed.color) embed.color = this.colors.default;
    if (interaction.acknowledged) return interaction.createFollowup({ embeds: [embed], content, flags: ephermal ? Constants.MessageFlags.EPHEMERAL : null });
    return interaction.createMessage({ embeds: [embed], content, flags: ephermal ? Constants.MessageFlags.EPHEMERAL : null });
  }

  public async sendRaw(data: string | InteractionContent, file?: FileContent | FileContent[]) {
    const interaction = this.interaction as CommandInteraction | ComponentInteraction;

    if (interaction.acknowledged) return interaction.createFollowup(data, file);
    return interaction.createMessage(data, file);
  }

  public sendChoices(data: ApplicationCommandOptionChoice[]) {
    const interaction = this.interaction as AutocompleteInteraction;

    interaction.result(data);
  }

  public async editRaw(data: string | InteractionContent, messageId?: string, file?: FileContent | FileContent[]) {
    const interaction = this.interaction as CommandInteraction | ComponentInteraction;

    if (interaction instanceof ComponentInteraction) {
      if (!messageId) return interaction.editParent(data as InteractionContent);
      return interaction.editMessage(messageId, data, file);
    }

    if (!messageId) return interaction.editOriginalMessage(data);
    return interaction.editMessage(messageId, data, file);
  }

  public async success(message: string, ephermal = false) {
    return this.send(`${this.emojis.check} ${message}`, ephermal);
  }

  public async error(message: string, ephermal = false) {
    return this.send(`${this.emojis.xmark} ${message}`, ephermal);
  }

  public async confirm(content: string, ephermal = false): Promise<ComponentInteraction & AwaitComponentReturn> {
    const interaction = this.interaction as CommandInteraction;
    const id = this.client.util.generateId();

    interaction.createMessage({
      content,
      components: [{
        type: 1,
        components: [{
          label: 'Yes',
          type: Constants.ComponentTypes.BUTTON,
          custom_id: `confirm-yes:${id}`,
          style: Constants.ButtonStyles.SUCCESS,
        },
        {
          label: 'No',
          type: Constants.ComponentTypes.BUTTON,
          custom_id: `confirm-no:${id}`,
          style: Constants.ButtonStyles.DANGER,
        }],
      }],
      flags: ephermal ? Constants.MessageFlags.EPHEMERAL : null,
    });

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.client.interactionHandler.awaits.delete(id);

        reject(new InteractionTimeoutError('Prompt timed out!'));
      }, 60000);

      this.client.interactionHandler.awaits.set(id, { timeout, resolve, interaction, responder: this });
    });
  }
}
