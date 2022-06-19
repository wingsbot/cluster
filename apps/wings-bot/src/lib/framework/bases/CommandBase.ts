import type { ApplicationCommandOptions, CommandInteraction, ComponentInteraction, InteractionDataOptionsWithValue } from 'eris';
import type { Responder, Store } from '../../core';
import type { Shard } from '../../../Shard';
import { CooldownGuard } from '../guards/CooldownGuard';

export interface CommandData {
  data: CommandInteraction['data'];
  options: Array<InteractionDataOptionsWithValue & { options: CommandData['options'] }>;
  interaction: CommandInteraction;
  responder: Responder;
  cooldown: CooldownGuard;
}

export interface ComponentData {
  data: ComponentInteraction['data'];
  interaction: ComponentInteraction;
  responder: Responder;
}

export interface Choices {
  name: string;
  value: string | number;
}
export class CommandBase {
  client: Shard;
  store: Store;
  name: string;
  description: string;
  type: 1 | 2 | 3;
  cooldown?: number;
  options?: ApplicationCommandOptions[];
  premiumOnly?: boolean;
  ownerOnly?: boolean;
  testing?: boolean;
  guildOnly?: boolean;
  componentExec?: ({ interaction, data, responder }: ComponentData) => Promise<void>;
  exec: ({ interaction, data, options, responder }: CommandData) => Promise<void>;

  constructor(client: Shard, name: string, store: Store) {
    this.client = client;
    this.name = name;
    this.type = 1;
    this.store = store;
  }

  get commandName() {
    return this.name;
  }
}
