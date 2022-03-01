import { ChannelCredentials } from '@grpc/grpc-js';
import { ActiveItem, AddActiveItemRequest, AddActiveItemResponse, AddInventoryItemRequest,
  AddInventoryItemResponse,
  DeleteInventoryItemRequest, DeleteInventoryItemResponse, DeleteInventoryItemsRequest,
  DeleteInventoryItemsResponse, EconomyClient, GetActiveItemsRequest,
  GetInventoryRequest, TopTenUser, InventoryItem, JoinGangRequest,
  JoinGangResponse, LeaveGangRequest, LeaveGangResponse, RemoveActiveItemRequest,
  RemoveActiveItemResponse, RemoveInventoryItemRequest, RemoveInventoryItemResponse,
  UpdateBalanceRequest, UpdateBalanceResponse, UpdateBankCapRequest,
  UpdateBankCapResponse, UpdateBankRequest, UpdateBankResponse,
  UserDataRequest, UserDataResponse } from '../../../../generated/economy';

export class GrpcEconomyClient {
  private readonly economyClient: EconomyClient;

  constructor(address: string, credentials: ChannelCredentials) {
    this.economyClient = new EconomyClient(address, credentials);
  }

  public async getUser(userId: string): Promise<UserDataResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.getUserData(UserDataRequest.fromJSON({ userId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async updateBalance(userId: string, balance: string): Promise<UpdateBalanceResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.updateBalance(UpdateBalanceRequest.fromJSON({ userId, balance }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async updateBank(userId: string, bank: string): Promise<UpdateBankResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.updateBank(UpdateBankRequest.fromJSON({ userId, bank }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async updateBankCap(userId: string, bankCap: string): Promise<UpdateBankCapResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.updateBankCap(UpdateBankCapRequest.fromJSON({ userId, bankCap }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async joinGang(userId: string, gangId: string): Promise<JoinGangResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.joinGang(JoinGangRequest.fromJSON({ userId, gangId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async leaveGang(userId: string): Promise<LeaveGangResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.leaveGang(LeaveGangRequest.fromJSON({ userId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async getTopTen(): Promise<TopTenUser[]> {
    return new Promise((resolve, reject) => {
      this.economyClient.getTopTen(null, (error, response) => {
        if (error) reject(error);
        resolve(response.users);
      });
    });
  }

  public async getUserInventory(userId: string): Promise<InventoryItem[]> {
    return new Promise((resolve, reject) => {
      this.economyClient.getInventory(GetInventoryRequest.fromJSON({ userId }), (error, response) => {
        if (error) reject(error);
        resolve(response.inventory);
      });
    });
  }

  public async addInventoryItem(userId: string, item: InventoryItem): Promise<AddInventoryItemResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.addInventoryItem(AddInventoryItemRequest.fromJSON({ userId, item }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async removeInventoryItem(userId: string, item: InventoryItem): Promise<RemoveInventoryItemResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.removeInventoryItem(RemoveInventoryItemRequest.fromJSON({ userId, item }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async deleteInventoryItem(userId: string, item: InventoryItem): Promise<DeleteInventoryItemResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.deleteInventoryItem(DeleteInventoryItemRequest.fromJSON({ userId, item }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async deleteInventoryItems(userId: string, filterList: string[]): Promise<DeleteInventoryItemsResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.deleteInventoryItems(DeleteInventoryItemsRequest.fromJSON({ userId, filterList }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async getActiveItems(userId: string): Promise<ActiveItem[]> {
    return new Promise((resolve, reject) => {
      this.economyClient.getActiveItems(GetActiveItemsRequest.fromJSON({ userId }), (error, response) => {
        if (error) reject(error);
        resolve(response.activeItems);
      });
    });
  }

  public async addActiveItem(userId: string, activeItem: ActiveItem): Promise<AddActiveItemResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.addActiveItem(AddActiveItemRequest.fromJSON({ userId, activeItem }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async removeActiveItem(userId: string, activeItem: ActiveItem): Promise<RemoveActiveItemResponse> {
    return new Promise((resolve, reject) => {
      this.economyClient.removeActiveItem(RemoveActiveItemRequest.fromJSON({ userId, activeItem }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }
}
