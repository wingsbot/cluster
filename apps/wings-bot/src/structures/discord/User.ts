import { APIUser } from 'discord-api-types/v10';

export class User {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar: string;
  bot?: boolean;

  constructor(private APIUser: APIUser) {
    this.id = this.APIUser.id;
    this.username = this.APIUser.username;
    this.discriminator = this.APIUser.discriminator;
    this.tag = `${this.APIUser.username}#${this.APIUser.discriminator}`;
    this.avatar = this.APIUser.avatar;
    this.bot = this.APIUser.bot;
  }

  get avatarURL() {
    if (!this.avatar) return `https://cdn.discordapp.com/avatars/${this.id}/${Number(this.discriminator) % 5}.png`;

    const format = this.avatar.includes('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}`;
  }
}
