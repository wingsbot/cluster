import { APIInteractionDataResolvedGuildMember, APIUser } from "discord-api-types/v10";
import { User } from "../../User";

export class ResolvedMember extends User {
  public joinedAt: string;
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

  constructor(APIMember: APIInteractionDataResolvedGuildMember, APIuser: APIUser) {
    super(APIuser);

    // server data
    this.joinedAt = APIMember.joined_at;
    this.permissions = APIMember.permissions;
    this.roles = APIMember.roles;
    if (APIMember.avatar) this.serverAvatar = APIMember.avatar;
    if (APIMember.communication_disabled_until) this.userTimedoutUntil = APIMember.communication_disabled_until;
    if (APIMember.nick) this.nick = APIMember.nick;
    if (APIMember.pending) this.pending = APIMember.pending;
    if (APIMember.premium_since) this.boostingServerSince = APIMember.premium_since;
  }
}