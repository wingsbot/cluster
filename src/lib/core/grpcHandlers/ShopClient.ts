import { ChannelCredentials } from '@grpc/grpc-js';
import { AddSpecialItemRequest, AddSpecialItemResponse, RemoveSpecialItemRequest,
  RemoveSpecialItemResponse, ShopClient, SpecialItem } from '../../../../generated/shop';

export class GrpcShopClient {
  private readonly shopClient: ShopClient;

  constructor(address: string, credentials: ChannelCredentials) {
    this.shopClient = new ShopClient(address, credentials);
  }

  public async getSpecialItems(): Promise<SpecialItem[]> {
    return new Promise((resolve, reject) => {
      this.shopClient.getSpecialItems(null, (error, response) => {
        if (error) reject(error);
        resolve(response.specialItems);
      });
    });
  }

  public async addSpecialItem(item: SpecialItem): Promise<AddSpecialItemResponse> {
    return new Promise((resolve, reject) => {
      this.shopClient.addSpecialItem(AddSpecialItemRequest.fromJSON({ item }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async removeSpecialItem(item: SpecialItem): Promise<RemoveSpecialItemResponse> {
    return new Promise((resolve, reject) => {
      this.shopClient.removeSpecialItem(RemoveSpecialItemRequest.fromJSON({ item }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }
}
