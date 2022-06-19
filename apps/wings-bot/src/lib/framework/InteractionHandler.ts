import { join } from 'node:path';
import { Constants, CommandInteraction, UnknownInteraction, ComponentInteraction, AutocompleteInteraction, InteractionDataOptionsWithValue } from 'eris';
import type { EventListeners, ApplicationCommandStructure } from 'eris';
import type { Inventory, Shop } from '@prisma/client';

import { Responder } from '../core';
import { Store } from '../core/fs/Store';

import type { Shard } from '../../Shard';
import { CooldownGuard } from './guards/CooldownGuard';
import type { CommandBase, CommandData, ComponentData } from '.';

export interface AwaitComponent {
  timeout: NodeJS.Timeout;
  interaction: CommandInteraction;
  responder: Responder;
  global?: boolean;
  strict?: boolean;
  resolve: (unknown: any) => void;
}

export interface AwaitComponentReturn {
  parsedId: string;
  userId: string;
  responder: Responder;
}

export interface AutocompleteChoices {
  name: string;
  value: string;
}

export class InteractionHandler {
  readonly client: Shard;
  awaits: Map<string, AwaitComponent> = new Map();
  activeAwaits: Map<string, string> = new Map();
  components: Map<string, AwaitComponent> = new Map();

  constructor(client: Shard) {
    this.client = client;
    this.client.commands = new Store(this.client, join(__dirname, '../../commands'), true);

    setTimeout(() => {
      this.loadCommands();
    }, 1000);

    this.client.on('interactionCreate', this.handleInteraction.bind(this));
  }

  // Functions to load the commands to discord.
  get canLoadCommands() {
    return this.client.firstShardId === 0;
  }

  getCommand(name: string): CommandBase {
    return this.client.commands.get(name);
  }

  private async loadCommands() {
    if (!this.canLoadCommands) return;
    const globalCommands: ApplicationCommandStructure[] = [];
    const ownerCommands: ApplicationCommandStructure[] = [];

    for (const cmd of this.client.commands.values()) {
      if (globalCommands.find(c => c.name === cmd.name) || ownerCommands.find(c => c.name === cmd.name)) {
        throw new Error('You have duplicate command names.');
      }

      const cmdObject: ApplicationCommandStructure = {
        name: cmd.name,
        description: cmd.description,
        type: cmd.type,
        options: cmd.options,
      };

      if (cmd.ownerOnly) {
        ownerCommands.push(cmdObject);
        continue;
      }

      globalCommands.push(cmdObject);
    }

    this.loadGlobalCommands(globalCommands);
    this.loadOwnerCommands(ownerCommands);
  }

  private async loadGlobalCommands(globalCommands: ApplicationCommandStructure[]) {
    if (globalCommands.length === 0) return;

    const discordGlobalLoadedCommands = await this.client.getCommands();
    if (this.client.util.deepEquals(globalCommands, discordGlobalLoadedCommands, ['id', 'applicaton_id', 'version', 'default_permission', 'guild_id'])) return;

    await this.client.bulkEditCommands(globalCommands);
  }

  private async loadOwnerCommands(ownerCommands: ApplicationCommandStructure[]) {
    if (ownerCommands.length === 0) return;

    const ownerLoadedCommands = await this.client.getGuildCommands('710373103972253717');
    if (this.client.util.deepEquals(ownerCommands, ownerLoadedCommands, ['id', 'applicaton_id', 'version', 'default_permission', 'guild_id'])) return;

    await this.client.bulkEditGuildCommands('710373103972253717', ownerCommands);
  }

  // Handling for interactions
  private async handleInteraction(interaction: EventListeners['interactionCreate'][0]) {
    if (interaction instanceof UnknownInteraction) return;

    switch (interaction.type) {
      case Constants.InteractionTypes.APPLICATION_COMMAND: {
        this.runCommand(interaction);

        break;
      }

      case Constants.InteractionTypes.MESSAGE_COMPONENT: {
        this.handleComponent(interaction);

        break;
      }

      case Constants.InteractionTypes.APPLICATION_COMMAND_AUTOCOMPLETE: {
        this.handleAutocomplete(interaction);

        break;
      }

      default: {
        throw new Error(`interaction type: ${interaction.type} was not implemented `);
      }
    }
  }

  private async runCommand(interaction: CommandInteraction) {
    const ctx: CommandData = {
      interaction: null,
      responder: null,
      cooldown: null,
      options: null,
      data: null,
    };
    const command = this.getCommand(interaction.data.name);

    // this would be my fault lmfao
    if (!command) throw new Error(`The Command ${command.name} was not found.. how the fuck did you manage that.`);
    ctx.interaction = interaction;
    ctx.responder = new Responder(this.client, interaction);

    // check permissions???
    if (this.activeAwaits.has(interaction.member.id)) {
      ctx.responder.sendEmbed({
        author: {
          name: interaction.member.tag,
          icon_url: interaction.member.avatarURL,
        },
        title: `You already have an active ${command.name} prompt!`,
        description: `[Press me to go to prompt](${this.activeAwaits.get(interaction.member.id)})`,
        color: ctx.responder.colors.red,
      }, '', true);

      return;
    }

    if (command.cooldown) ctx.cooldown = new CooldownGuard(this.client, ctx.responder, command);
    if (command.cooldown && await ctx.cooldown.exists) {
      ctx.cooldown.handleMessage();
      return;
    }

    if (command.premiumOnly) {
      const isUserPremium = await this.client.patreon.hasPremium(interaction.member.id);

      if (!isUserPremium) {
        ctx.responder.sendEmbed({
          title: 'You must purchase premium to access this command!',
          url: 'https://wingsbot.net/premium',
          description: 'For more information, do the command `/info premium`',
          timestamp: new Date().toISOString(),
        });

        return;
      }
    }

    ctx.data = interaction.data;
    ctx.options = interaction.data.options as CommandData['options'];

    this.client.modules.levels.handleLeveling(interaction);

    try {
      await command.exec(ctx);
    } catch (error: any) {
      this.client.emit('commandError', ({ command, responder: ctx.responder, error }));
    }
  }

  async handleComponent(interaction: ComponentInteraction) {
    const ctx: ComponentData = {
      interaction: null,
      data: null,
      responder: null,
    };
    const [custom, id] = interaction.data.custom_id.split(':');
    const awaitComponent = this.awaits.get(id);

    ctx.interaction = interaction;
    ctx.data = interaction.data;
    ctx.responder = new Responder(this.client, interaction);

    if (!awaitComponent) {
      const command = this.getCommand(interaction.message.interaction.name);
      if (!command || !command.componentExec) return;

      try {
        await command.componentExec(ctx);
      } catch (error: any) {
        this.client.emit('componentError', ({ command, interaction, error }));
      }

      return;
    }

    if (!awaitComponent.global && awaitComponent.interaction.member.id !== interaction.member.id) {
      ctx.responder.error('You can\'t respond to this message.', true);
      return;
    }

    clearTimeout(awaitComponent.timeout);

    if (awaitComponent.strict) this.activeAwaits.delete(awaitComponent.interaction.member.id);
    this.awaits.delete(id);

    awaitComponent.resolve({ ...interaction, responder: ctx.responder, userId: interaction.member.id, parsedId: custom });
  }

  private async handleAutocomplete(interaction: AutocompleteInteraction) {
    const commandName = interaction.data.name;
    const options = interaction.data.options as InteractionDataOptionsWithValue[];
    const responder = new Responder(this.client, interaction);
    let items: AutocompleteChoices[];

    switch (commandName) {
      case 'buy': {
        const userInput = options[0].value as string;
        const userData = await this.client.modules.economy.getUserData(interaction.member.id);

        items = this.client.modules.shop.getShopItems().reduce((oldItem: AutocompleteChoices[], newItem: Shop) => {
          if (newItem.name.toLowerCase().includes(userInput.toLowerCase())) {
            if (newItem.itemId === 'upgradebank') newItem.price = BigInt(Math.round(Number(userData.bankCap) / 3));

            const item = {
              name: `${newItem.name} - ${this.client.modules.economy.parseInt(newItem.price)}`,
              value: newItem.itemId,
            };

            oldItem = [...oldItem, item];
          }

          return oldItem;
        }, []);

        break;
      }

      case 'sell': {
        const userInput = options[0].value as string;
        const userInventory = await this.client.modules.economy.getUserInventory(interaction.member.id);
        const allItemsOption = {
          name: 'All Items',
          itemId: 'allItems',
          description: 'none',
          count: 0,
          price: 0,
          useable: false,
          canBeSold: false,
          replyMessage: 'none',
        };

        const inventory = [...userInventory, allItemsOption];

        items = inventory
          .reverse()
          .reduce((oldItem: AutocompleteChoices[], newItem: Inventory) => {
            if (newItem.name.toLowerCase().includes(userInput.toLowerCase())) {
              const item = {
                name: newItem.name,
                value: newItem.itemId,
              };

              oldItem = [...oldItem, item];
            }

            return oldItem;
          }, []);

        break;
      }

      case 'use': {
        const userInput = options[0].value as string;
        const userInventory = await this.client.modules.economy.getUserInventory(interaction.member.id);
        const inventory = [...userInventory];

        items = inventory
          .reverse()
          .filter(item => item.useable)
          .reduce((oldItem: AutocompleteChoices[], newItem: Inventory) => {
            if (newItem.name.toLowerCase().includes(userInput.toLowerCase())) {
              const item = {
                name: newItem.name,
                value: newItem.itemId,
              };

              oldItem = [...oldItem, item];
            }

            return oldItem;
          }, []);

        break;
      }

      case 'item-info': {
        const userInput = options[0].value as string;
        const userInventory = await this.client.modules.economy.getUserInventory(interaction.member.id);
        const inventory = [...userInventory];

        items = inventory
          .reverse()
          .reduce((oldItem: AutocompleteChoices[], newItem: Inventory) => {
            if (newItem.name.toLowerCase().includes(userInput.toLowerCase())) {
              const item = {
                name: newItem.name,
                value: newItem.itemId,
              };

              oldItem = [...oldItem, item];
            }

            return oldItem;
          }, []);

        break;
      }

      default: {
        break;
      }
    }

    responder.sendChoices(items);
  }
}
