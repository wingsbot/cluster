import { APIInteractionGuildMember } from 'discord-api-types/v10';
import { User } from './User';

export class Member extends User {
  deaf: boolean;
  joinedAt: string;
  mute: boolean;
  permissions: string;
  roles: string[];
  serverAvatar?: string;
  userTimedoutUntil?: string;
  nick?: string;
  pending?: boolean;
  boostingServerSince?: string;

  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar: string;
  bot?: boolean;

  constructor(APIMember: APIInteractionGuildMember) {
    super(APIMember.user);

    // server data
    this.deaf = APIMember.deaf;
    this.joinedAt = APIMember.joined_at;
    this.mute = APIMember.mute;
    this.permissions = APIMember.permissions;
    this.roles = APIMember.roles;
    if (APIMember.avatar) this.serverAvatar = APIMember.avatar;
    if (APIMember.communication_disabled_until) this.userTimedoutUntil = APIMember.communication_disabled_until;
    if (APIMember.nick) this.nick = APIMember.nick;
    if (APIMember.pending) this.pending = APIMember.pending;
    if (APIMember.premium_since) this.boostingServerSince = APIMember.premium_since;
  }
}
