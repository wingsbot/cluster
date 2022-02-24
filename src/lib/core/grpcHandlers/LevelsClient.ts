import { ChannelCredentials } from '@grpc/grpc-js';
import { GetUserRequest, GetUserResponse, LevelsClient,
  LevelUserData, UpdateUserRequest, UpdateUserResponse } from '../../../../generated/levels';

export class GrpcLevelsClient {
  private readonly levelsClient: LevelsClient;

  constructor(address: string, credentials: ChannelCredentials) {
    this.levelsClient = new LevelsClient(address, credentials);
  }

  public async getUserData(userId: string): Promise<GetUserResponse> {
    return new Promise((resolve, reject) => {
      this.levelsClient.getUser(GetUserRequest.fromJSON({ userId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async updateUser(userId: string, userData: LevelUserData): Promise<UpdateUserResponse> {
    return new Promise((resolve, reject) => {
      this.levelsClient.updateUser(UpdateUserRequest.fromJSON({ userId, userData }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async getAllUsers(): Promise<LevelUserData[]> {
    return new Promise((resolve, reject) => {
      this.levelsClient.getAllUsers(null, (error, response) => {
        if (error) reject(error);
        resolve(response.users);
      });
    });
  }

  public async getTopTen(): Promise<LevelUserData[]> {
    return new Promise((resolve, reject) => {
      this.levelsClient.getTopTen(null, (error, response) => {
        if (error) reject(error);
        resolve(response.users);
      });
    });
  }
}
