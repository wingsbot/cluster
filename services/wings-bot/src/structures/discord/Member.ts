import { APIInteractionGuildMember } from "discord-api-types/v10";

export class Member {
  public deaf: boolean;
  public joinedAt: string;
  public mute: boolean;
  public permissions: string;
  public roles: string[];
  public serverAvatar?: string;
  public userTimedoutUntil?: string;
  public nick?: string;
  public pending?: boolean;
  public boostingServerSince?: string;

  public id: string;
  public username: string;
  public discriminator: string;
  public tag: string;
  public avatar: string;
  public bot?: boolean;

  constructor(APIMember: APIInteractionGuildMember) {
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


    // user data
    this.id = APIMember.user.id;
    this.avatar = APIMember.user.avatar;
    this.username = APIMember.user.username;
    this.discriminator = APIMember.user.discriminator;
    this.tag = `${APIMember.user.username}#${APIMember.user.discriminator}`;
    this.bot = APIMember.user.bot;
  }
}