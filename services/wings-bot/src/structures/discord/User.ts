import { APIUser } from "discord-api-types/v10";

export class User {
  public id: string;
  public username: string;
  public discriminator: string;
  public tag: string;
  public avatar: string;
  public bot?: boolean;

  constructor(APIUser: APIUser) {
    this.id = APIUser.id;
    this.username = APIUser.username;
    this.discriminator = APIUser.discriminator;
    this.tag = `${APIUser.username}#${APIUser.discriminator}`;
    this.avatar = APIUser.avatar;
    this.bot = APIUser.bot;
  }

  get avatarURL() {
    if (!this.avatar) return `https://cdn.discordapp.com/avatars/${this.id}/${this.discriminator % 5}.png`;

    const format = this.avatar.includes("a_") ? "gif" : 'png';
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}`;
  }
}