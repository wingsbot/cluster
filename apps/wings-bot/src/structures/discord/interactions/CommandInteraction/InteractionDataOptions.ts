import {
  APIApplicationCommandInteractionDataOption,
  APIAttachment,
  APIChatInputApplicationCommandInteractionDataResolved,
  APIInteractionDataResolvedChannel,
  APIRole,
  ApplicationCommandOptionType,
} from 'discord-api-types/v10';
import type { CommandOptions } from '../../../bot';
import { ResolvedMember } from '..';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ExtractOptions<T> = T extends CommandOptions<infer _Name, infer _Type, infer Options, infer _Choices> ? Options[number] : never;

type ParseOption<C extends CommandOptions> =
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  C extends CommandOptions<infer Name, infer Type, infer _O, infer _Choices>
    ? {
      name: Name;
      valueType: OptionTypes<C>[Type]
    }
    : never;

type ValueOf<ObjectType, ValueType extends keyof ObjectType = keyof ObjectType> = ObjectType[ValueType];

type OptionTypes<C extends CommandOptions = CommandOptions> = {
  [ApplicationCommandOptionType.Subcommand]: CommandInteractionDataOptions<C>;
  [ApplicationCommandOptionType.SubcommandGroup]: CommandInteractionDataOptions<C>;
  [ApplicationCommandOptionType.String]: string;
  [ApplicationCommandOptionType.Integer]: number;
  [ApplicationCommandOptionType.Boolean]: boolean;
  [ApplicationCommandOptionType.User]: ResolvedMember;
  [ApplicationCommandOptionType.Channel]: APIInteractionDataResolvedChannel;
  [ApplicationCommandOptionType.Role]: APIRole;
  [ApplicationCommandOptionType.Mentionable]: string;
  [ApplicationCommandOptionType.Number]: number;
  [ApplicationCommandOptionType.Attachment]: APIAttachment;
};

export class CommandInteractionDataOptions<T extends CommandOptions = CommandOptions> {
  constructor(public options: APIApplicationCommandInteractionDataOption[], private resolved: APIChatInputApplicationCommandInteractionDataResolved) {}

  get<O extends ExtractOptions<T>['name']>(name: O): Extract<ParseOption<ExtractOptions<T>>, { name: O }>['valueType'] {
    const option = name ? this.options.find(o => o.name === name) : this.options[0];

    if (!option) return null;
    return this.parseOption(option);
  }

  private parseOption(option: APIApplicationCommandInteractionDataOption): ValueOf<OptionTypes> {
    const parsed = this.parseDiscordOption(option);

    return parsed;
  }

  private parseDiscordOption(option: APIApplicationCommandInteractionDataOption): ValueOf<OptionTypes> {
    switch (option.type) {
    case ApplicationCommandOptionType.Boolean:
    case ApplicationCommandOptionType.String:
    case ApplicationCommandOptionType.Integer:
    case ApplicationCommandOptionType.Number:
      return option.value;

    case ApplicationCommandOptionType.Attachment:
      return this.resolved?.attachments?.[option.value];

    case ApplicationCommandOptionType.User: {
      const member = this.resolved?.members?.[option.value];
      const user = this.resolved?.users?.[option.value];
      return new ResolvedMember(member, user);
    }

    case ApplicationCommandOptionType.Role: // TODO: make role structure class
      return this.resolved?.roles?.[option.value];

    case ApplicationCommandOptionType.Channel: // TODO: make channel structure class
      return this.resolved?.channels?.[option.value];

    case ApplicationCommandOptionType.Mentionable: {
      const role = this.resolved?.roles?.[option.value];
      return role ? role : this.parseOption({ ...option, type: ApplicationCommandOptionType.User });
    }

    case ApplicationCommandOptionType.Subcommand:
    case ApplicationCommandOptionType.SubcommandGroup:
      return new CommandInteractionDataOptions(option.options, this.resolved);
    }
  }
}

