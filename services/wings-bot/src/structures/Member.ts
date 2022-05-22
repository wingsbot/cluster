import { APIInteractionGuildMember } from "discord-api-types/v10";

export class Member {
  public serverAvatar: string;
  public userTimedoutUntil: string;
  public deaf: boolean;
  public joinedAt: string;
  public mute: boolean;
  public nick: string;
  public pending: boolean;
  public permissions: string;
  public boostingServerSince: string;
  public roles: string[];

  public id: string;
  public username: string;
  public discriminator: string;
  public tag: string;
  public avatar: string;
  public bot: boolean;

  constructor(APIMember: APIInteractionGuildMember) {
    // server data
    this.serverAvatar = APIMember.avatar;
    this.userTimedoutUntil = APIMember.communication_disabled_until;
    this.deaf = APIMember.deaf;
    this.joinedAt = APIMember.joined_at;
    this.mute = APIMember.mute;
    this.nick = APIMember.nick;
    this.pending = APIMember.pending;
    this.permissions = APIMember.permissions;
    this.boostingServerSince = APIMember.premium_since;
    this.roles = APIMember.roles;

    // user data
    this.id = APIMember.user.id;
    this.avatar = APIMember.user.avatar;
    this.username = APIMember.user.username;
    this.discriminator = APIMember.user.discriminator;
    this.tag = `${APIMember.user.username}#${APIMember.user.discriminator}`;
    this.bot = APIMember.user.bot;
  }
}