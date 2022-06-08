import { CommandBase, CommandData } from '../../lib/framework';

export default class Monthly extends CommandBase {
  description = 'Get a batch of 🍖100,000.';

  // months are silly so we use google :)
  // maybe make it an every beginning of month thing but idk
  cooldown = 2.4192e+9;

  exec = async ({ cooldown, interaction, responder }: CommandData) => {
    const multiplier = await this.client.modules.economy.getMultiplier(interaction.member.id);

    await this.client.modules.economy.editBalance(interaction.member.id, 100000 * multiplier);
    responder.success(`You collected your monthly ${this.client.modules.economy.parseInt(100000 * multiplier)}`);
    cooldown.setCooldown();
  };
}
