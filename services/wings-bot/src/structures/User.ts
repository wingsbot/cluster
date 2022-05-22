import { APIUser } from "discord-api-types/v10";

export class User {
  public id: string;
  public username: string;
  public discriminator: string;
  public tag: string;
  public avatar: string;
  public bot: boolean;

  constructor(APIUser: APIUser) {
    this.id = APIUser.id;
    this.username = APIUser.username;
    this.discriminator = APIUser.discriminator;
    this.tag = `${APIUser.username}#${APIUser.discriminator}`;
    this.avatar = APIUser.avatar;
    this.bot = APIUser.bot;
  }
}