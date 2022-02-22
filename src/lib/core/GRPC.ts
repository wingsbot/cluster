import { credentials } from '@grpc/grpc-js';
import { GrpcEconomyClient } from './grpcHandlers/EconomyClient';
import { GrpcShopClient } from './grpcHandlers/ShopClient';

export class GRPC {
  private readonly credidentials = credentials.createInsecure();
  public economy: GrpcEconomyClient;
  public shop: GrpcShopClient;

  constructor() {
    this.economy = new GrpcEconomyClient('127.0.0.1:3000', this.credidentials);
    this.shop = new GrpcShopClient('127.0.0.1:3000', this.credidentials);
  }
}
