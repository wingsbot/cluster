import { APIUser } from 'discord-api-types/v10';

export class User {
  id: string;
  username: string;
  discriminator: string;
  tag: string;
  avatar: string;
  bot?: boolean;

  constructor(APIUser: APIUser) {
    this.id = APIUser.id;
    this.username = APIUser.username;
    this.discriminator = APIUser.discriminator;
    this.tag = `${APIUser.username}#${APIUser.discriminator}`;
    this.avatar = APIUser.avatar;
    this.bot = APIUser.bot;
  }

  get avatarURL() {
    if (!this.avatar) return `https://cdn.discordapp.com/avatars/${this.id}/${Number(this.discriminator) % 5}.png`;

    const format = this.avatar.includes('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${this.id}/${this.avatar}.${format}`;
  }
}
