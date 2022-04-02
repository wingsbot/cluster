/* eslint-disable */
import Long from "long";
import {
  makeGenericClientConstructor,
  ChannelCredentials,
  ChannelOptions,
  UntypedServiceImplementation,
  handleUnaryCall,
  Client,
  ClientUnaryCall,
  Metadata,
  CallOptions,
  ServiceError,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Timestamp } from "./google/protobuf/timestamp";

export const protobufPackage = "economy";

export interface UserDataRequest {
  userId: string;
}

export interface UserDataResponse {
  id: string;
  balance: number;
  bank: number;
  bankCap: number;
  gangId?: string | undefined;
}

export interface UserData {
  id: string;
  balance: number;
  bank: number;
  bankCap: number;
  gangId: string;
}

export interface InventoryItem {
  id?: number | undefined;
  itemId: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerUp?: boolean | undefined;
  cooldownBetweenPurchase?: number | undefined;
  priceStack?: boolean | undefined;
  durability?: number | undefined;
  maxDurability?: number | undefined;
  maxInInv?: number | undefined;
  stock?: number | undefined;
  usageTime?: number | undefined;
  timeBought?: Date | undefined;
  timeUsed?: Date | undefined;
}

export interface ActiveItem {
  id?: number | undefined;
  itemId: string;
  userId: string;
  guildId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerUp?: boolean | undefined;
  cooldownBetweenPurchase?: number | undefined;
  priceStack?: boolean | undefined;
  durability?: number | undefined;
  maxDurability?: number | undefined;
  maxInInv?: number | undefined;
  stock?: number | undefined;
  usageTime?: number | undefined;
  timeBought?: Date | undefined;
  timeUsed?: Date | undefined;
}

export interface TopTenUser {
  id: string;
  summed: number;
}

export interface UpdateBalanceRequest {
  userId: string;
  balance: number;
}

export interface UpdateBalanceResponse {}

export interface UpdateBankRequest {
  userId: string;
  bank: number;
}

export interface UpdateBankResponse {}

export interface UpdateBankCapRequest {
  userId: string;
  bankCap: number;
}

export interface UpdateBankCapResponse {}

export interface GetTopTenRequest {}

export interface GetTopTenResponse {
  users: TopTenUser[];
}

export interface JoinGangRequest {
  userId: string;
  gangId: string;
}

export interface JoinGangResponse {}

export interface LeaveGangRequest {
  userId: string;
}

export interface LeaveGangResponse {}

export interface GetInventoryRequest {
  userId: string;
}

export interface GetInventoryResponse {
  inventory: InventoryItem[];
}

export interface AddInventoryItemRequest {
  userId: string;
  item: InventoryItem | undefined;
}

export interface AddInventoryItemResponse {
  id: number;
  itemId: string;
  userId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerUp?: boolean | undefined;
  cooldownBetweenPurchase?: number | undefined;
  priceStack?: boolean | undefined;
  durability?: number | undefined;
  maxDurability?: number | undefined;
  maxInInv?: number | undefined;
  stock?: number | undefined;
  usageTime?: number | undefined;
  timeBought?: Date | undefined;
  timeUsed?: Date | undefined;
}

export interface RemoveInventoryItemRequest {
  userId: string;
  item: InventoryItem | undefined;
}

export interface RemoveInventoryItemResponse {}

export interface DeleteInventoryItemRequest {
  userId: string;
  item: InventoryItem | undefined;
}

export interface DeleteInventoryItemResponse {}

export interface DeleteInventoryItemsRequest {
  userId: string;
  filterList: string[];
}

export interface DeleteInventoryItemsResponse {}

export interface GetActiveItemsRequest {
  userId: string;
}

export interface GetActiveItemsResponse {
  activeItems: ActiveItem[];
}

export interface AddActiveItemRequest {
  userId: string;
  activeItem: ActiveItem | undefined;
}

export interface AddActiveItemResponse {
  id: number;
  itemId: string;
  userId: string;
  guildId: string;
  name: string;
  description: string;
  price: number;
  canBeSold: boolean;
  replyMessage: string;
  count: number;
  useable: boolean;
  powerUp?: boolean | undefined;
  cooldownBetweenPurchase?: number | undefined;
  priceStack?: boolean | undefined;
  durability?: number | undefined;
  maxDurability?: number | undefined;
  maxInInv?: number | undefined;
  stock?: number | undefined;
  usageTime?: number | undefined;
  timeBought?: Date | undefined;
  timeUsed?: Date | undefined;
}

export interface RemoveActiveItemRequest {
  userId: string;
  activeItem: ActiveItem | undefined;
}

export interface RemoveActiveItemResponse {}

function createBaseUserDataRequest(): UserDataRequest {
  return { userId: "" };
}

export const UserDataRequest = {
  encode(
    message: UserDataRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserDataRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserDataRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserDataRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: UserDataRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserDataRequest>, I>>(
    object: I
  ): UserDataRequest {
    const message = createBaseUserDataRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseUserDataResponse(): UserDataResponse {
  return { id: "", balance: 0, bank: 0, bankCap: 0, gangId: undefined };
}

export const UserDataResponse = {
  encode(
    message: UserDataResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.balance !== 0) {
      writer.uint32(17).sfixed64(message.balance);
    }
    if (message.bank !== 0) {
      writer.uint32(25).sfixed64(message.bank);
    }
    if (message.bankCap !== 0) {
      writer.uint32(33).fixed64(message.bankCap);
    }
    if (message.gangId !== undefined) {
      writer.uint32(42).string(message.gangId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserDataResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserDataResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.balance = longToNumber(reader.sfixed64() as Long);
          break;
        case 3:
          message.bank = longToNumber(reader.sfixed64() as Long);
          break;
        case 4:
          message.bankCap = longToNumber(reader.fixed64() as Long);
          break;
        case 5:
          message.gangId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserDataResponse {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      bank: isSet(object.bank) ? Number(object.bank) : 0,
      bankCap: isSet(object.bankCap) ? Number(object.bankCap) : 0,
      gangId: isSet(object.gangId) ? String(object.gangId) : undefined,
    };
  },

  toJSON(message: UserDataResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.balance !== undefined &&
      (obj.balance = Math.round(message.balance));
    message.bank !== undefined && (obj.bank = Math.round(message.bank));
    message.bankCap !== undefined &&
      (obj.bankCap = Math.round(message.bankCap));
    message.gangId !== undefined && (obj.gangId = message.gangId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserDataResponse>, I>>(
    object: I
  ): UserDataResponse {
    const message = createBaseUserDataResponse();
    message.id = object.id ?? "";
    message.balance = object.balance ?? 0;
    message.bank = object.bank ?? 0;
    message.bankCap = object.bankCap ?? 0;
    message.gangId = object.gangId ?? undefined;
    return message;
  },
};

function createBaseUserData(): UserData {
  return { id: "", balance: 0, bank: 0, bankCap: 0, gangId: "" };
}

export const UserData = {
  encode(
    message: UserData,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.balance !== 0) {
      writer.uint32(17).sfixed64(message.balance);
    }
    if (message.bank !== 0) {
      writer.uint32(25).sfixed64(message.bank);
    }
    if (message.bankCap !== 0) {
      writer.uint32(33).fixed64(message.bankCap);
    }
    if (message.gangId !== "") {
      writer.uint32(42).string(message.gangId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserData {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUserData();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.balance = longToNumber(reader.sfixed64() as Long);
          break;
        case 3:
          message.bank = longToNumber(reader.sfixed64() as Long);
          break;
        case 4:
          message.bankCap = longToNumber(reader.fixed64() as Long);
          break;
        case 5:
          message.gangId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserData {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      balance: isSet(object.balance) ? Number(object.balance) : 0,
      bank: isSet(object.bank) ? Number(object.bank) : 0,
      bankCap: isSet(object.bankCap) ? Number(object.bankCap) : 0,
      gangId: isSet(object.gangId) ? String(object.gangId) : "",
    };
  },

  toJSON(message: UserData): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.balance !== undefined &&
      (obj.balance = Math.round(message.balance));
    message.bank !== undefined && (obj.bank = Math.round(message.bank));
    message.bankCap !== undefined &&
      (obj.bankCap = Math.round(message.bankCap));
    message.gangId !== undefined && (obj.gangId = message.gangId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserData>, I>>(object: I): UserData {
    const message = createBaseUserData();
    message.id = object.id ?? "";
    message.balance = object.balance ?? 0;
    message.bank = object.bank ?? 0;
    message.bankCap = object.bankCap ?? 0;
    message.gangId = object.gangId ?? "";
    return message;
  },
};

function createBaseInventoryItem(): InventoryItem {
  return {
    id: undefined,
    itemId: "",
    userId: "",
    name: "",
    description: "",
    price: 0,
    canBeSold: false,
    replyMessage: "",
    count: 0,
    useable: false,
    powerUp: undefined,
    cooldownBetweenPurchase: undefined,
    priceStack: undefined,
    durability: undefined,
    maxDurability: undefined,
    maxInInv: undefined,
    stock: undefined,
    usageTime: undefined,
    timeBought: undefined,
    timeUsed: undefined,
  };
}

export const InventoryItem = {
  encode(
    message: InventoryItem,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== undefined) {
      writer.uint32(9).fixed64(message.id);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.price !== 0) {
      writer.uint32(49).fixed64(message.price);
    }
    if (message.canBeSold === true) {
      writer.uint32(56).bool(message.canBeSold);
    }
    if (message.replyMessage !== "") {
      writer.uint32(66).string(message.replyMessage);
    }
    if (message.count !== 0) {
      writer.uint32(72).uint64(message.count);
    }
    if (message.useable === true) {
      writer.uint32(80).bool(message.useable);
    }
    if (message.powerUp !== undefined) {
      writer.uint32(88).bool(message.powerUp);
    }
    if (message.cooldownBetweenPurchase !== undefined) {
      writer.uint32(97).fixed64(message.cooldownBetweenPurchase);
    }
    if (message.priceStack !== undefined) {
      writer.uint32(104).bool(message.priceStack);
    }
    if (message.durability !== undefined) {
      writer.uint32(112).uint64(message.durability);
    }
    if (message.maxDurability !== undefined) {
      writer.uint32(120).uint64(message.maxDurability);
    }
    if (message.maxInInv !== undefined) {
      writer.uint32(129).fixed64(message.maxInInv);
    }
    if (message.stock !== undefined) {
      writer.uint32(137).fixed64(message.stock);
    }
    if (message.usageTime !== undefined) {
      writer.uint32(145).fixed64(message.usageTime);
    }
    if (message.timeBought !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeBought),
        writer.uint32(154).fork()
      ).ldelim();
    }
    if (message.timeUsed !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeUsed),
        writer.uint32(162).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InventoryItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseInventoryItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.fixed64() as Long);
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          message.price = longToNumber(reader.fixed64() as Long);
          break;
        case 7:
          message.canBeSold = reader.bool();
          break;
        case 8:
          message.replyMessage = reader.string();
          break;
        case 9:
          message.count = longToNumber(reader.uint64() as Long);
          break;
        case 10:
          message.useable = reader.bool();
          break;
        case 11:
          message.powerUp = reader.bool();
          break;
        case 12:
          message.cooldownBetweenPurchase = longToNumber(
            reader.fixed64() as Long
          );
          break;
        case 13:
          message.priceStack = reader.bool();
          break;
        case 14:
          message.durability = longToNumber(reader.uint64() as Long);
          break;
        case 15:
          message.maxDurability = longToNumber(reader.uint64() as Long);
          break;
        case 16:
          message.maxInInv = longToNumber(reader.fixed64() as Long);
          break;
        case 17:
          message.stock = longToNumber(reader.fixed64() as Long);
          break;
        case 18:
          message.usageTime = longToNumber(reader.fixed64() as Long);
          break;
        case 19:
          message.timeBought = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 20:
          message.timeUsed = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InventoryItem {
    return {
      id: isSet(object.id) ? Number(object.id) : undefined,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      price: isSet(object.price) ? Number(object.price) : 0,
      canBeSold: isSet(object.canBeSold) ? Boolean(object.canBeSold) : false,
      replyMessage: isSet(object.replyMessage)
        ? String(object.replyMessage)
        : "",
      count: isSet(object.count) ? Number(object.count) : 0,
      useable: isSet(object.useable) ? Boolean(object.useable) : false,
      powerUp: isSet(object.powerUp) ? Boolean(object.powerUp) : undefined,
      cooldownBetweenPurchase: isSet(object.cooldownBetweenPurchase)
        ? Number(object.cooldownBetweenPurchase)
        : undefined,
      priceStack: isSet(object.priceStack)
        ? Boolean(object.priceStack)
        : undefined,
      durability: isSet(object.durability)
        ? Number(object.durability)
        : undefined,
      maxDurability: isSet(object.maxDurability)
        ? Number(object.maxDurability)
        : undefined,
      maxInInv: isSet(object.maxInInv) ? Number(object.maxInInv) : undefined,
      stock: isSet(object.stock) ? Number(object.stock) : undefined,
      usageTime: isSet(object.usageTime) ? Number(object.usageTime) : undefined,
      timeBought: isSet(object.timeBought)
        ? fromJsonTimestamp(object.timeBought)
        : undefined,
      timeUsed: isSet(object.timeUsed)
        ? fromJsonTimestamp(object.timeUsed)
        : undefined,
    };
  },

  toJSON(message: InventoryItem): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined &&
      (obj.description = message.description);
    message.price !== undefined && (obj.price = Math.round(message.price));
    message.canBeSold !== undefined && (obj.canBeSold = message.canBeSold);
    message.replyMessage !== undefined &&
      (obj.replyMessage = message.replyMessage);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.useable !== undefined && (obj.useable = message.useable);
    message.powerUp !== undefined && (obj.powerUp = message.powerUp);
    message.cooldownBetweenPurchase !== undefined &&
      (obj.cooldownBetweenPurchase = Math.round(
        message.cooldownBetweenPurchase
      ));
    message.priceStack !== undefined && (obj.priceStack = message.priceStack);
    message.durability !== undefined &&
      (obj.durability = Math.round(message.durability));
    message.maxDurability !== undefined &&
      (obj.maxDurability = Math.round(message.maxDurability));
    message.maxInInv !== undefined &&
      (obj.maxInInv = Math.round(message.maxInInv));
    message.stock !== undefined && (obj.stock = Math.round(message.stock));
    message.usageTime !== undefined &&
      (obj.usageTime = Math.round(message.usageTime));
    message.timeBought !== undefined &&
      (obj.timeBought = message.timeBought.toISOString());
    message.timeUsed !== undefined &&
      (obj.timeUsed = message.timeUsed.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InventoryItem>, I>>(
    object: I
  ): InventoryItem {
    const message = createBaseInventoryItem();
    message.id = object.id ?? undefined;
    message.itemId = object.itemId ?? "";
    message.userId = object.userId ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.price = object.price ?? 0;
    message.canBeSold = object.canBeSold ?? false;
    message.replyMessage = object.replyMessage ?? "";
    message.count = object.count ?? 0;
    message.useable = object.useable ?? false;
    message.powerUp = object.powerUp ?? undefined;
    message.cooldownBetweenPurchase =
      object.cooldownBetweenPurchase ?? undefined;
    message.priceStack = object.priceStack ?? undefined;
    message.durability = object.durability ?? undefined;
    message.maxDurability = object.maxDurability ?? undefined;
    message.maxInInv = object.maxInInv ?? undefined;
    message.stock = object.stock ?? undefined;
    message.usageTime = object.usageTime ?? undefined;
    message.timeBought = object.timeBought ?? undefined;
    message.timeUsed = object.timeUsed ?? undefined;
    return message;
  },
};

function createBaseActiveItem(): ActiveItem {
  return {
    id: undefined,
    itemId: "",
    userId: "",
    guildId: "",
    name: "",
    description: "",
    price: 0,
    canBeSold: false,
    replyMessage: "",
    count: 0,
    useable: false,
    powerUp: undefined,
    cooldownBetweenPurchase: undefined,
    priceStack: undefined,
    durability: undefined,
    maxDurability: undefined,
    maxInInv: undefined,
    stock: undefined,
    usageTime: undefined,
    timeBought: undefined,
    timeUsed: undefined,
  };
}

export const ActiveItem = {
  encode(
    message: ActiveItem,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== undefined) {
      writer.uint32(9).fixed64(message.id);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.guildId !== "") {
      writer.uint32(34).string(message.guildId);
    }
    if (message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(50).string(message.description);
    }
    if (message.price !== 0) {
      writer.uint32(57).fixed64(message.price);
    }
    if (message.canBeSold === true) {
      writer.uint32(64).bool(message.canBeSold);
    }
    if (message.replyMessage !== "") {
      writer.uint32(74).string(message.replyMessage);
    }
    if (message.count !== 0) {
      writer.uint32(80).uint64(message.count);
    }
    if (message.useable === true) {
      writer.uint32(88).bool(message.useable);
    }
    if (message.powerUp !== undefined) {
      writer.uint32(96).bool(message.powerUp);
    }
    if (message.cooldownBetweenPurchase !== undefined) {
      writer.uint32(105).fixed64(message.cooldownBetweenPurchase);
    }
    if (message.priceStack !== undefined) {
      writer.uint32(112).bool(message.priceStack);
    }
    if (message.durability !== undefined) {
      writer.uint32(120).uint64(message.durability);
    }
    if (message.maxDurability !== undefined) {
      writer.uint32(128).uint64(message.maxDurability);
    }
    if (message.maxInInv !== undefined) {
      writer.uint32(137).fixed64(message.maxInInv);
    }
    if (message.stock !== undefined) {
      writer.uint32(145).fixed64(message.stock);
    }
    if (message.usageTime !== undefined) {
      writer.uint32(153).fixed64(message.usageTime);
    }
    if (message.timeBought !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeBought),
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.timeUsed !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeUsed),
        writer.uint32(170).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): ActiveItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseActiveItem();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.fixed64() as Long);
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.guildId = reader.string();
          break;
        case 5:
          message.name = reader.string();
          break;
        case 6:
          message.description = reader.string();
          break;
        case 7:
          message.price = longToNumber(reader.fixed64() as Long);
          break;
        case 8:
          message.canBeSold = reader.bool();
          break;
        case 9:
          message.replyMessage = reader.string();
          break;
        case 10:
          message.count = longToNumber(reader.uint64() as Long);
          break;
        case 11:
          message.useable = reader.bool();
          break;
        case 12:
          message.powerUp = reader.bool();
          break;
        case 13:
          message.cooldownBetweenPurchase = longToNumber(
            reader.fixed64() as Long
          );
          break;
        case 14:
          message.priceStack = reader.bool();
          break;
        case 15:
          message.durability = longToNumber(reader.uint64() as Long);
          break;
        case 16:
          message.maxDurability = longToNumber(reader.uint64() as Long);
          break;
        case 17:
          message.maxInInv = longToNumber(reader.fixed64() as Long);
          break;
        case 18:
          message.stock = longToNumber(reader.fixed64() as Long);
          break;
        case 19:
          message.usageTime = longToNumber(reader.fixed64() as Long);
          break;
        case 20:
          message.timeBought = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 21:
          message.timeUsed = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): ActiveItem {
    return {
      id: isSet(object.id) ? Number(object.id) : undefined,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      guildId: isSet(object.guildId) ? String(object.guildId) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      price: isSet(object.price) ? Number(object.price) : 0,
      canBeSold: isSet(object.canBeSold) ? Boolean(object.canBeSold) : false,
      replyMessage: isSet(object.replyMessage)
        ? String(object.replyMessage)
        : "",
      count: isSet(object.count) ? Number(object.count) : 0,
      useable: isSet(object.useable) ? Boolean(object.useable) : false,
      powerUp: isSet(object.powerUp) ? Boolean(object.powerUp) : undefined,
      cooldownBetweenPurchase: isSet(object.cooldownBetweenPurchase)
        ? Number(object.cooldownBetweenPurchase)
        : undefined,
      priceStack: isSet(object.priceStack)
        ? Boolean(object.priceStack)
        : undefined,
      durability: isSet(object.durability)
        ? Number(object.durability)
        : undefined,
      maxDurability: isSet(object.maxDurability)
        ? Number(object.maxDurability)
        : undefined,
      maxInInv: isSet(object.maxInInv) ? Number(object.maxInInv) : undefined,
      stock: isSet(object.stock) ? Number(object.stock) : undefined,
      usageTime: isSet(object.usageTime) ? Number(object.usageTime) : undefined,
      timeBought: isSet(object.timeBought)
        ? fromJsonTimestamp(object.timeBought)
        : undefined,
      timeUsed: isSet(object.timeUsed)
        ? fromJsonTimestamp(object.timeUsed)
        : undefined,
    };
  },

  toJSON(message: ActiveItem): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.guildId !== undefined && (obj.guildId = message.guildId);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined &&
      (obj.description = message.description);
    message.price !== undefined && (obj.price = Math.round(message.price));
    message.canBeSold !== undefined && (obj.canBeSold = message.canBeSold);
    message.replyMessage !== undefined &&
      (obj.replyMessage = message.replyMessage);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.useable !== undefined && (obj.useable = message.useable);
    message.powerUp !== undefined && (obj.powerUp = message.powerUp);
    message.cooldownBetweenPurchase !== undefined &&
      (obj.cooldownBetweenPurchase = Math.round(
        message.cooldownBetweenPurchase
      ));
    message.priceStack !== undefined && (obj.priceStack = message.priceStack);
    message.durability !== undefined &&
      (obj.durability = Math.round(message.durability));
    message.maxDurability !== undefined &&
      (obj.maxDurability = Math.round(message.maxDurability));
    message.maxInInv !== undefined &&
      (obj.maxInInv = Math.round(message.maxInInv));
    message.stock !== undefined && (obj.stock = Math.round(message.stock));
    message.usageTime !== undefined &&
      (obj.usageTime = Math.round(message.usageTime));
    message.timeBought !== undefined &&
      (obj.timeBought = message.timeBought.toISOString());
    message.timeUsed !== undefined &&
      (obj.timeUsed = message.timeUsed.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<ActiveItem>, I>>(
    object: I
  ): ActiveItem {
    const message = createBaseActiveItem();
    message.id = object.id ?? undefined;
    message.itemId = object.itemId ?? "";
    message.userId = object.userId ?? "";
    message.guildId = object.guildId ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.price = object.price ?? 0;
    message.canBeSold = object.canBeSold ?? false;
    message.replyMessage = object.replyMessage ?? "";
    message.count = object.count ?? 0;
    message.useable = object.useable ?? false;
    message.powerUp = object.powerUp ?? undefined;
    message.cooldownBetweenPurchase =
      object.cooldownBetweenPurchase ?? undefined;
    message.priceStack = object.priceStack ?? undefined;
    message.durability = object.durability ?? undefined;
    message.maxDurability = object.maxDurability ?? undefined;
    message.maxInInv = object.maxInInv ?? undefined;
    message.stock = object.stock ?? undefined;
    message.usageTime = object.usageTime ?? undefined;
    message.timeBought = object.timeBought ?? undefined;
    message.timeUsed = object.timeUsed ?? undefined;
    return message;
  },
};

function createBaseTopTenUser(): TopTenUser {
  return { id: "", summed: 0 };
}

export const TopTenUser = {
  encode(
    message: TopTenUser,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    if (message.summed !== 0) {
      writer.uint32(17).fixed64(message.summed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TopTenUser {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopTenUser();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = reader.string();
          break;
        case 2:
          message.summed = longToNumber(reader.fixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TopTenUser {
    return {
      id: isSet(object.id) ? String(object.id) : "",
      summed: isSet(object.summed) ? Number(object.summed) : 0,
    };
  },

  toJSON(message: TopTenUser): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = message.id);
    message.summed !== undefined && (obj.summed = Math.round(message.summed));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TopTenUser>, I>>(
    object: I
  ): TopTenUser {
    const message = createBaseTopTenUser();
    message.id = object.id ?? "";
    message.summed = object.summed ?? 0;
    return message;
  },
};

function createBaseUpdateBalanceRequest(): UpdateBalanceRequest {
  return { userId: "", balance: 0 };
}

export const UpdateBalanceRequest = {
  encode(
    message: UpdateBalanceRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.balance !== 0) {
      writer.uint32(17).sfixed64(message.balance);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateBalanceRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateBalanceRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.balance = longToNumber(reader.sfixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateBalanceRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      balance: isSet(object.balance) ? Number(object.balance) : 0,
    };
  },

  toJSON(message: UpdateBalanceRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.balance !== undefined &&
      (obj.balance = Math.round(message.balance));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateBalanceRequest>, I>>(
    object: I
  ): UpdateBalanceRequest {
    const message = createBaseUpdateBalanceRequest();
    message.userId = object.userId ?? "";
    message.balance = object.balance ?? 0;
    return message;
  },
};

function createBaseUpdateBalanceResponse(): UpdateBalanceResponse {
  return {};
}

export const UpdateBalanceResponse = {
  encode(
    _: UpdateBalanceResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateBalanceResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateBalanceResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateBalanceResponse {
    return {};
  },

  toJSON(_: UpdateBalanceResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateBalanceResponse>, I>>(
    _: I
  ): UpdateBalanceResponse {
    const message = createBaseUpdateBalanceResponse();
    return message;
  },
};

function createBaseUpdateBankRequest(): UpdateBankRequest {
  return { userId: "", bank: 0 };
}

export const UpdateBankRequest = {
  encode(
    message: UpdateBankRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.bank !== 0) {
      writer.uint32(17).sfixed64(message.bank);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateBankRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateBankRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.bank = longToNumber(reader.sfixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateBankRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      bank: isSet(object.bank) ? Number(object.bank) : 0,
    };
  },

  toJSON(message: UpdateBankRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.bank !== undefined && (obj.bank = Math.round(message.bank));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateBankRequest>, I>>(
    object: I
  ): UpdateBankRequest {
    const message = createBaseUpdateBankRequest();
    message.userId = object.userId ?? "";
    message.bank = object.bank ?? 0;
    return message;
  },
};

function createBaseUpdateBankResponse(): UpdateBankResponse {
  return {};
}

export const UpdateBankResponse = {
  encode(
    _: UpdateBankResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UpdateBankResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateBankResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateBankResponse {
    return {};
  },

  toJSON(_: UpdateBankResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateBankResponse>, I>>(
    _: I
  ): UpdateBankResponse {
    const message = createBaseUpdateBankResponse();
    return message;
  },
};

function createBaseUpdateBankCapRequest(): UpdateBankCapRequest {
  return { userId: "", bankCap: 0 };
}

export const UpdateBankCapRequest = {
  encode(
    message: UpdateBankCapRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.bankCap !== 0) {
      writer.uint32(17).fixed64(message.bankCap);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateBankCapRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateBankCapRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.bankCap = longToNumber(reader.fixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UpdateBankCapRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      bankCap: isSet(object.bankCap) ? Number(object.bankCap) : 0,
    };
  },

  toJSON(message: UpdateBankCapRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.bankCap !== undefined &&
      (obj.bankCap = Math.round(message.bankCap));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateBankCapRequest>, I>>(
    object: I
  ): UpdateBankCapRequest {
    const message = createBaseUpdateBankCapRequest();
    message.userId = object.userId ?? "";
    message.bankCap = object.bankCap ?? 0;
    return message;
  },
};

function createBaseUpdateBankCapResponse(): UpdateBankCapResponse {
  return {};
}

export const UpdateBankCapResponse = {
  encode(
    _: UpdateBankCapResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): UpdateBankCapResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdateBankCapResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): UpdateBankCapResponse {
    return {};
  },

  toJSON(_: UpdateBankCapResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UpdateBankCapResponse>, I>>(
    _: I
  ): UpdateBankCapResponse {
    const message = createBaseUpdateBankCapResponse();
    return message;
  },
};

function createBaseGetTopTenRequest(): GetTopTenRequest {
  return {};
}

export const GetTopTenRequest = {
  encode(
    _: GetTopTenRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTopTenRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTopTenRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): GetTopTenRequest {
    return {};
  },

  toJSON(_: GetTopTenRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetTopTenRequest>, I>>(
    _: I
  ): GetTopTenRequest {
    const message = createBaseGetTopTenRequest();
    return message;
  },
};

function createBaseGetTopTenResponse(): GetTopTenResponse {
  return { users: [] };
}

export const GetTopTenResponse = {
  encode(
    message: GetTopTenResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.users) {
      TopTenUser.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetTopTenResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetTopTenResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.users.push(TopTenUser.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetTopTenResponse {
    return {
      users: Array.isArray(object?.users)
        ? object.users.map((e: any) => TopTenUser.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetTopTenResponse): unknown {
    const obj: any = {};
    if (message.users) {
      obj.users = message.users.map((e) =>
        e ? TopTenUser.toJSON(e) : undefined
      );
    } else {
      obj.users = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetTopTenResponse>, I>>(
    object: I
  ): GetTopTenResponse {
    const message = createBaseGetTopTenResponse();
    message.users = object.users?.map((e) => TopTenUser.fromPartial(e)) || [];
    return message;
  },
};

function createBaseJoinGangRequest(): JoinGangRequest {
  return { userId: "", gangId: "" };
}

export const JoinGangRequest = {
  encode(
    message: JoinGangRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.gangId !== "") {
      writer.uint32(18).string(message.gangId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinGangRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinGangRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.gangId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): JoinGangRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      gangId: isSet(object.gangId) ? String(object.gangId) : "",
    };
  },

  toJSON(message: JoinGangRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.gangId !== undefined && (obj.gangId = message.gangId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JoinGangRequest>, I>>(
    object: I
  ): JoinGangRequest {
    const message = createBaseJoinGangRequest();
    message.userId = object.userId ?? "";
    message.gangId = object.gangId ?? "";
    return message;
  },
};

function createBaseJoinGangResponse(): JoinGangResponse {
  return {};
}

export const JoinGangResponse = {
  encode(
    _: JoinGangResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): JoinGangResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseJoinGangResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): JoinGangResponse {
    return {};
  },

  toJSON(_: JoinGangResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<JoinGangResponse>, I>>(
    _: I
  ): JoinGangResponse {
    const message = createBaseJoinGangResponse();
    return message;
  },
};

function createBaseLeaveGangRequest(): LeaveGangRequest {
  return { userId: "" };
}

export const LeaveGangRequest = {
  encode(
    message: LeaveGangRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveGangRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveGangRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveGangRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: LeaveGangRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaveGangRequest>, I>>(
    object: I
  ): LeaveGangRequest {
    const message = createBaseLeaveGangRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseLeaveGangResponse(): LeaveGangResponse {
  return {};
}

export const LeaveGangResponse = {
  encode(
    _: LeaveGangResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveGangResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseLeaveGangResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): LeaveGangResponse {
    return {};
  },

  toJSON(_: LeaveGangResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaveGangResponse>, I>>(
    _: I
  ): LeaveGangResponse {
    const message = createBaseLeaveGangResponse();
    return message;
  },
};

function createBaseGetInventoryRequest(): GetInventoryRequest {
  return { userId: "" };
}

export const GetInventoryRequest = {
  encode(
    message: GetInventoryRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInventoryRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInventoryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInventoryRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: GetInventoryRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInventoryRequest>, I>>(
    object: I
  ): GetInventoryRequest {
    const message = createBaseGetInventoryRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetInventoryResponse(): GetInventoryResponse {
  return { inventory: [] };
}

export const GetInventoryResponse = {
  encode(
    message: GetInventoryResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.inventory) {
      InventoryItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetInventoryResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetInventoryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.inventory.push(InventoryItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInventoryResponse {
    return {
      inventory: Array.isArray(object?.inventory)
        ? object.inventory.map((e: any) => InventoryItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetInventoryResponse): unknown {
    const obj: any = {};
    if (message.inventory) {
      obj.inventory = message.inventory.map((e) =>
        e ? InventoryItem.toJSON(e) : undefined
      );
    } else {
      obj.inventory = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInventoryResponse>, I>>(
    object: I
  ): GetInventoryResponse {
    const message = createBaseGetInventoryResponse();
    message.inventory =
      object.inventory?.map((e) => InventoryItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddInventoryItemRequest(): AddInventoryItemRequest {
  return { userId: "", item: undefined };
}

export const AddInventoryItemRequest = {
  encode(
    message: AddInventoryItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.item !== undefined) {
      InventoryItem.encode(message.item, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AddInventoryItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddInventoryItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.item = InventoryItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddInventoryItemRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      item: isSet(object.item)
        ? InventoryItem.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: AddInventoryItemRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.item !== undefined &&
      (obj.item = message.item
        ? InventoryItem.toJSON(message.item)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddInventoryItemRequest>, I>>(
    object: I
  ): AddInventoryItemRequest {
    const message = createBaseAddInventoryItemRequest();
    message.userId = object.userId ?? "";
    message.item =
      object.item !== undefined && object.item !== null
        ? InventoryItem.fromPartial(object.item)
        : undefined;
    return message;
  },
};

function createBaseAddInventoryItemResponse(): AddInventoryItemResponse {
  return {
    id: 0,
    itemId: "",
    userId: "",
    name: "",
    description: "",
    price: 0,
    canBeSold: false,
    replyMessage: "",
    count: 0,
    useable: false,
    powerUp: undefined,
    cooldownBetweenPurchase: undefined,
    priceStack: undefined,
    durability: undefined,
    maxDurability: undefined,
    maxInInv: undefined,
    stock: undefined,
    usageTime: undefined,
    timeBought: undefined,
    timeUsed: undefined,
  };
}

export const AddInventoryItemResponse = {
  encode(
    message: AddInventoryItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(9).fixed64(message.id);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.name !== "") {
      writer.uint32(34).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(42).string(message.description);
    }
    if (message.price !== 0) {
      writer.uint32(49).fixed64(message.price);
    }
    if (message.canBeSold === true) {
      writer.uint32(56).bool(message.canBeSold);
    }
    if (message.replyMessage !== "") {
      writer.uint32(66).string(message.replyMessage);
    }
    if (message.count !== 0) {
      writer.uint32(72).uint64(message.count);
    }
    if (message.useable === true) {
      writer.uint32(80).bool(message.useable);
    }
    if (message.powerUp !== undefined) {
      writer.uint32(88).bool(message.powerUp);
    }
    if (message.cooldownBetweenPurchase !== undefined) {
      writer.uint32(97).fixed64(message.cooldownBetweenPurchase);
    }
    if (message.priceStack !== undefined) {
      writer.uint32(104).bool(message.priceStack);
    }
    if (message.durability !== undefined) {
      writer.uint32(112).uint64(message.durability);
    }
    if (message.maxDurability !== undefined) {
      writer.uint32(120).uint64(message.maxDurability);
    }
    if (message.maxInInv !== undefined) {
      writer.uint32(129).fixed64(message.maxInInv);
    }
    if (message.stock !== undefined) {
      writer.uint32(137).fixed64(message.stock);
    }
    if (message.usageTime !== undefined) {
      writer.uint32(145).fixed64(message.usageTime);
    }
    if (message.timeBought !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeBought),
        writer.uint32(154).fork()
      ).ldelim();
    }
    if (message.timeUsed !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeUsed),
        writer.uint32(162).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AddInventoryItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddInventoryItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.fixed64() as Long);
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.name = reader.string();
          break;
        case 5:
          message.description = reader.string();
          break;
        case 6:
          message.price = longToNumber(reader.fixed64() as Long);
          break;
        case 7:
          message.canBeSold = reader.bool();
          break;
        case 8:
          message.replyMessage = reader.string();
          break;
        case 9:
          message.count = longToNumber(reader.uint64() as Long);
          break;
        case 10:
          message.useable = reader.bool();
          break;
        case 11:
          message.powerUp = reader.bool();
          break;
        case 12:
          message.cooldownBetweenPurchase = longToNumber(
            reader.fixed64() as Long
          );
          break;
        case 13:
          message.priceStack = reader.bool();
          break;
        case 14:
          message.durability = longToNumber(reader.uint64() as Long);
          break;
        case 15:
          message.maxDurability = longToNumber(reader.uint64() as Long);
          break;
        case 16:
          message.maxInInv = longToNumber(reader.fixed64() as Long);
          break;
        case 17:
          message.stock = longToNumber(reader.fixed64() as Long);
          break;
        case 18:
          message.usageTime = longToNumber(reader.fixed64() as Long);
          break;
        case 19:
          message.timeBought = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 20:
          message.timeUsed = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddInventoryItemResponse {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      price: isSet(object.price) ? Number(object.price) : 0,
      canBeSold: isSet(object.canBeSold) ? Boolean(object.canBeSold) : false,
      replyMessage: isSet(object.replyMessage)
        ? String(object.replyMessage)
        : "",
      count: isSet(object.count) ? Number(object.count) : 0,
      useable: isSet(object.useable) ? Boolean(object.useable) : false,
      powerUp: isSet(object.powerUp) ? Boolean(object.powerUp) : undefined,
      cooldownBetweenPurchase: isSet(object.cooldownBetweenPurchase)
        ? Number(object.cooldownBetweenPurchase)
        : undefined,
      priceStack: isSet(object.priceStack)
        ? Boolean(object.priceStack)
        : undefined,
      durability: isSet(object.durability)
        ? Number(object.durability)
        : undefined,
      maxDurability: isSet(object.maxDurability)
        ? Number(object.maxDurability)
        : undefined,
      maxInInv: isSet(object.maxInInv) ? Number(object.maxInInv) : undefined,
      stock: isSet(object.stock) ? Number(object.stock) : undefined,
      usageTime: isSet(object.usageTime) ? Number(object.usageTime) : undefined,
      timeBought: isSet(object.timeBought)
        ? fromJsonTimestamp(object.timeBought)
        : undefined,
      timeUsed: isSet(object.timeUsed)
        ? fromJsonTimestamp(object.timeUsed)
        : undefined,
    };
  },

  toJSON(message: AddInventoryItemResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined &&
      (obj.description = message.description);
    message.price !== undefined && (obj.price = Math.round(message.price));
    message.canBeSold !== undefined && (obj.canBeSold = message.canBeSold);
    message.replyMessage !== undefined &&
      (obj.replyMessage = message.replyMessage);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.useable !== undefined && (obj.useable = message.useable);
    message.powerUp !== undefined && (obj.powerUp = message.powerUp);
    message.cooldownBetweenPurchase !== undefined &&
      (obj.cooldownBetweenPurchase = Math.round(
        message.cooldownBetweenPurchase
      ));
    message.priceStack !== undefined && (obj.priceStack = message.priceStack);
    message.durability !== undefined &&
      (obj.durability = Math.round(message.durability));
    message.maxDurability !== undefined &&
      (obj.maxDurability = Math.round(message.maxDurability));
    message.maxInInv !== undefined &&
      (obj.maxInInv = Math.round(message.maxInInv));
    message.stock !== undefined && (obj.stock = Math.round(message.stock));
    message.usageTime !== undefined &&
      (obj.usageTime = Math.round(message.usageTime));
    message.timeBought !== undefined &&
      (obj.timeBought = message.timeBought.toISOString());
    message.timeUsed !== undefined &&
      (obj.timeUsed = message.timeUsed.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddInventoryItemResponse>, I>>(
    object: I
  ): AddInventoryItemResponse {
    const message = createBaseAddInventoryItemResponse();
    message.id = object.id ?? 0;
    message.itemId = object.itemId ?? "";
    message.userId = object.userId ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.price = object.price ?? 0;
    message.canBeSold = object.canBeSold ?? false;
    message.replyMessage = object.replyMessage ?? "";
    message.count = object.count ?? 0;
    message.useable = object.useable ?? false;
    message.powerUp = object.powerUp ?? undefined;
    message.cooldownBetweenPurchase =
      object.cooldownBetweenPurchase ?? undefined;
    message.priceStack = object.priceStack ?? undefined;
    message.durability = object.durability ?? undefined;
    message.maxDurability = object.maxDurability ?? undefined;
    message.maxInInv = object.maxInInv ?? undefined;
    message.stock = object.stock ?? undefined;
    message.usageTime = object.usageTime ?? undefined;
    message.timeBought = object.timeBought ?? undefined;
    message.timeUsed = object.timeUsed ?? undefined;
    return message;
  },
};

function createBaseRemoveInventoryItemRequest(): RemoveInventoryItemRequest {
  return { userId: "", item: undefined };
}

export const RemoveInventoryItemRequest = {
  encode(
    message: RemoveInventoryItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.item !== undefined) {
      InventoryItem.encode(message.item, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveInventoryItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveInventoryItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.item = InventoryItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveInventoryItemRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      item: isSet(object.item)
        ? InventoryItem.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: RemoveInventoryItemRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.item !== undefined &&
      (obj.item = message.item
        ? InventoryItem.toJSON(message.item)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveInventoryItemRequest>, I>>(
    object: I
  ): RemoveInventoryItemRequest {
    const message = createBaseRemoveInventoryItemRequest();
    message.userId = object.userId ?? "";
    message.item =
      object.item !== undefined && object.item !== null
        ? InventoryItem.fromPartial(object.item)
        : undefined;
    return message;
  },
};

function createBaseRemoveInventoryItemResponse(): RemoveInventoryItemResponse {
  return {};
}

export const RemoveInventoryItemResponse = {
  encode(
    _: RemoveInventoryItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveInventoryItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveInventoryItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): RemoveInventoryItemResponse {
    return {};
  },

  toJSON(_: RemoveInventoryItemResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveInventoryItemResponse>, I>>(
    _: I
  ): RemoveInventoryItemResponse {
    const message = createBaseRemoveInventoryItemResponse();
    return message;
  },
};

function createBaseDeleteInventoryItemRequest(): DeleteInventoryItemRequest {
  return { userId: "", item: undefined };
}

export const DeleteInventoryItemRequest = {
  encode(
    message: DeleteInventoryItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.item !== undefined) {
      InventoryItem.encode(message.item, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeleteInventoryItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteInventoryItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.item = InventoryItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteInventoryItemRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      item: isSet(object.item)
        ? InventoryItem.fromJSON(object.item)
        : undefined,
    };
  },

  toJSON(message: DeleteInventoryItemRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.item !== undefined &&
      (obj.item = message.item
        ? InventoryItem.toJSON(message.item)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteInventoryItemRequest>, I>>(
    object: I
  ): DeleteInventoryItemRequest {
    const message = createBaseDeleteInventoryItemRequest();
    message.userId = object.userId ?? "";
    message.item =
      object.item !== undefined && object.item !== null
        ? InventoryItem.fromPartial(object.item)
        : undefined;
    return message;
  },
};

function createBaseDeleteInventoryItemResponse(): DeleteInventoryItemResponse {
  return {};
}

export const DeleteInventoryItemResponse = {
  encode(
    _: DeleteInventoryItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeleteInventoryItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteInventoryItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): DeleteInventoryItemResponse {
    return {};
  },

  toJSON(_: DeleteInventoryItemResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteInventoryItemResponse>, I>>(
    _: I
  ): DeleteInventoryItemResponse {
    const message = createBaseDeleteInventoryItemResponse();
    return message;
  },
};

function createBaseDeleteInventoryItemsRequest(): DeleteInventoryItemsRequest {
  return { userId: "", filterList: [] };
}

export const DeleteInventoryItemsRequest = {
  encode(
    message: DeleteInventoryItemsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    for (const v of message.filterList) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeleteInventoryItemsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteInventoryItemsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.filterList.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeleteInventoryItemsRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      filterList: Array.isArray(object?.filterList)
        ? object.filterList.map((e: any) => String(e))
        : [],
    };
  },

  toJSON(message: DeleteInventoryItemsRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    if (message.filterList) {
      obj.filterList = message.filterList.map((e) => e);
    } else {
      obj.filterList = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteInventoryItemsRequest>, I>>(
    object: I
  ): DeleteInventoryItemsRequest {
    const message = createBaseDeleteInventoryItemsRequest();
    message.userId = object.userId ?? "";
    message.filterList = object.filterList?.map((e) => e) || [];
    return message;
  },
};

function createBaseDeleteInventoryItemsResponse(): DeleteInventoryItemsResponse {
  return {};
}

export const DeleteInventoryItemsResponse = {
  encode(
    _: DeleteInventoryItemsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): DeleteInventoryItemsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDeleteInventoryItemsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): DeleteInventoryItemsResponse {
    return {};
  },

  toJSON(_: DeleteInventoryItemsResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeleteInventoryItemsResponse>, I>>(
    _: I
  ): DeleteInventoryItemsResponse {
    const message = createBaseDeleteInventoryItemsResponse();
    return message;
  },
};

function createBaseGetActiveItemsRequest(): GetActiveItemsRequest {
  return { userId: "" };
}

export const GetActiveItemsRequest = {
  encode(
    message: GetActiveItemsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetActiveItemsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetActiveItemsRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetActiveItemsRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: GetActiveItemsRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetActiveItemsRequest>, I>>(
    object: I
  ): GetActiveItemsRequest {
    const message = createBaseGetActiveItemsRequest();
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetActiveItemsResponse(): GetActiveItemsResponse {
  return { activeItems: [] };
}

export const GetActiveItemsResponse = {
  encode(
    message: GetActiveItemsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.activeItems) {
      ActiveItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetActiveItemsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetActiveItemsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activeItems.push(ActiveItem.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetActiveItemsResponse {
    return {
      activeItems: Array.isArray(object?.activeItems)
        ? object.activeItems.map((e: any) => ActiveItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetActiveItemsResponse): unknown {
    const obj: any = {};
    if (message.activeItems) {
      obj.activeItems = message.activeItems.map((e) =>
        e ? ActiveItem.toJSON(e) : undefined
      );
    } else {
      obj.activeItems = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetActiveItemsResponse>, I>>(
    object: I
  ): GetActiveItemsResponse {
    const message = createBaseGetActiveItemsResponse();
    message.activeItems =
      object.activeItems?.map((e) => ActiveItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddActiveItemRequest(): AddActiveItemRequest {
  return { userId: "", activeItem: undefined };
}

export const AddActiveItemRequest = {
  encode(
    message: AddActiveItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.activeItem !== undefined) {
      ActiveItem.encode(message.activeItem, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AddActiveItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddActiveItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.activeItem = ActiveItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddActiveItemRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      activeItem: isSet(object.activeItem)
        ? ActiveItem.fromJSON(object.activeItem)
        : undefined,
    };
  },

  toJSON(message: AddActiveItemRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.activeItem !== undefined &&
      (obj.activeItem = message.activeItem
        ? ActiveItem.toJSON(message.activeItem)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddActiveItemRequest>, I>>(
    object: I
  ): AddActiveItemRequest {
    const message = createBaseAddActiveItemRequest();
    message.userId = object.userId ?? "";
    message.activeItem =
      object.activeItem !== undefined && object.activeItem !== null
        ? ActiveItem.fromPartial(object.activeItem)
        : undefined;
    return message;
  },
};

function createBaseAddActiveItemResponse(): AddActiveItemResponse {
  return {
    id: 0,
    itemId: "",
    userId: "",
    guildId: "",
    name: "",
    description: "",
    price: 0,
    canBeSold: false,
    replyMessage: "",
    count: 0,
    useable: false,
    powerUp: undefined,
    cooldownBetweenPurchase: undefined,
    priceStack: undefined,
    durability: undefined,
    maxDurability: undefined,
    maxInInv: undefined,
    stock: undefined,
    usageTime: undefined,
    timeBought: undefined,
    timeUsed: undefined,
  };
}

export const AddActiveItemResponse = {
  encode(
    message: AddActiveItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(9).fixed64(message.id);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.guildId !== "") {
      writer.uint32(34).string(message.guildId);
    }
    if (message.name !== "") {
      writer.uint32(42).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(50).string(message.description);
    }
    if (message.price !== 0) {
      writer.uint32(57).fixed64(message.price);
    }
    if (message.canBeSold === true) {
      writer.uint32(64).bool(message.canBeSold);
    }
    if (message.replyMessage !== "") {
      writer.uint32(74).string(message.replyMessage);
    }
    if (message.count !== 0) {
      writer.uint32(80).uint64(message.count);
    }
    if (message.useable === true) {
      writer.uint32(88).bool(message.useable);
    }
    if (message.powerUp !== undefined) {
      writer.uint32(96).bool(message.powerUp);
    }
    if (message.cooldownBetweenPurchase !== undefined) {
      writer.uint32(105).fixed64(message.cooldownBetweenPurchase);
    }
    if (message.priceStack !== undefined) {
      writer.uint32(112).bool(message.priceStack);
    }
    if (message.durability !== undefined) {
      writer.uint32(120).uint64(message.durability);
    }
    if (message.maxDurability !== undefined) {
      writer.uint32(128).uint64(message.maxDurability);
    }
    if (message.maxInInv !== undefined) {
      writer.uint32(137).fixed64(message.maxInInv);
    }
    if (message.stock !== undefined) {
      writer.uint32(145).fixed64(message.stock);
    }
    if (message.usageTime !== undefined) {
      writer.uint32(153).fixed64(message.usageTime);
    }
    if (message.timeBought !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeBought),
        writer.uint32(162).fork()
      ).ldelim();
    }
    if (message.timeUsed !== undefined) {
      Timestamp.encode(
        toTimestamp(message.timeUsed),
        writer.uint32(170).fork()
      ).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AddActiveItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddActiveItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.id = longToNumber(reader.fixed64() as Long);
          break;
        case 2:
          message.itemId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.guildId = reader.string();
          break;
        case 5:
          message.name = reader.string();
          break;
        case 6:
          message.description = reader.string();
          break;
        case 7:
          message.price = longToNumber(reader.fixed64() as Long);
          break;
        case 8:
          message.canBeSold = reader.bool();
          break;
        case 9:
          message.replyMessage = reader.string();
          break;
        case 10:
          message.count = longToNumber(reader.uint64() as Long);
          break;
        case 11:
          message.useable = reader.bool();
          break;
        case 12:
          message.powerUp = reader.bool();
          break;
        case 13:
          message.cooldownBetweenPurchase = longToNumber(
            reader.fixed64() as Long
          );
          break;
        case 14:
          message.priceStack = reader.bool();
          break;
        case 15:
          message.durability = longToNumber(reader.uint64() as Long);
          break;
        case 16:
          message.maxDurability = longToNumber(reader.uint64() as Long);
          break;
        case 17:
          message.maxInInv = longToNumber(reader.fixed64() as Long);
          break;
        case 18:
          message.stock = longToNumber(reader.fixed64() as Long);
          break;
        case 19:
          message.usageTime = longToNumber(reader.fixed64() as Long);
          break;
        case 20:
          message.timeBought = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        case 21:
          message.timeUsed = fromTimestamp(
            Timestamp.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddActiveItemResponse {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      guildId: isSet(object.guildId) ? String(object.guildId) : "",
      name: isSet(object.name) ? String(object.name) : "",
      description: isSet(object.description) ? String(object.description) : "",
      price: isSet(object.price) ? Number(object.price) : 0,
      canBeSold: isSet(object.canBeSold) ? Boolean(object.canBeSold) : false,
      replyMessage: isSet(object.replyMessage)
        ? String(object.replyMessage)
        : "",
      count: isSet(object.count) ? Number(object.count) : 0,
      useable: isSet(object.useable) ? Boolean(object.useable) : false,
      powerUp: isSet(object.powerUp) ? Boolean(object.powerUp) : undefined,
      cooldownBetweenPurchase: isSet(object.cooldownBetweenPurchase)
        ? Number(object.cooldownBetweenPurchase)
        : undefined,
      priceStack: isSet(object.priceStack)
        ? Boolean(object.priceStack)
        : undefined,
      durability: isSet(object.durability)
        ? Number(object.durability)
        : undefined,
      maxDurability: isSet(object.maxDurability)
        ? Number(object.maxDurability)
        : undefined,
      maxInInv: isSet(object.maxInInv) ? Number(object.maxInInv) : undefined,
      stock: isSet(object.stock) ? Number(object.stock) : undefined,
      usageTime: isSet(object.usageTime) ? Number(object.usageTime) : undefined,
      timeBought: isSet(object.timeBought)
        ? fromJsonTimestamp(object.timeBought)
        : undefined,
      timeUsed: isSet(object.timeUsed)
        ? fromJsonTimestamp(object.timeUsed)
        : undefined,
    };
  },

  toJSON(message: AddActiveItemResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.itemId !== undefined && (obj.itemId = message.itemId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.guildId !== undefined && (obj.guildId = message.guildId);
    message.name !== undefined && (obj.name = message.name);
    message.description !== undefined &&
      (obj.description = message.description);
    message.price !== undefined && (obj.price = Math.round(message.price));
    message.canBeSold !== undefined && (obj.canBeSold = message.canBeSold);
    message.replyMessage !== undefined &&
      (obj.replyMessage = message.replyMessage);
    message.count !== undefined && (obj.count = Math.round(message.count));
    message.useable !== undefined && (obj.useable = message.useable);
    message.powerUp !== undefined && (obj.powerUp = message.powerUp);
    message.cooldownBetweenPurchase !== undefined &&
      (obj.cooldownBetweenPurchase = Math.round(
        message.cooldownBetweenPurchase
      ));
    message.priceStack !== undefined && (obj.priceStack = message.priceStack);
    message.durability !== undefined &&
      (obj.durability = Math.round(message.durability));
    message.maxDurability !== undefined &&
      (obj.maxDurability = Math.round(message.maxDurability));
    message.maxInInv !== undefined &&
      (obj.maxInInv = Math.round(message.maxInInv));
    message.stock !== undefined && (obj.stock = Math.round(message.stock));
    message.usageTime !== undefined &&
      (obj.usageTime = Math.round(message.usageTime));
    message.timeBought !== undefined &&
      (obj.timeBought = message.timeBought.toISOString());
    message.timeUsed !== undefined &&
      (obj.timeUsed = message.timeUsed.toISOString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddActiveItemResponse>, I>>(
    object: I
  ): AddActiveItemResponse {
    const message = createBaseAddActiveItemResponse();
    message.id = object.id ?? 0;
    message.itemId = object.itemId ?? "";
    message.userId = object.userId ?? "";
    message.guildId = object.guildId ?? "";
    message.name = object.name ?? "";
    message.description = object.description ?? "";
    message.price = object.price ?? 0;
    message.canBeSold = object.canBeSold ?? false;
    message.replyMessage = object.replyMessage ?? "";
    message.count = object.count ?? 0;
    message.useable = object.useable ?? false;
    message.powerUp = object.powerUp ?? undefined;
    message.cooldownBetweenPurchase =
      object.cooldownBetweenPurchase ?? undefined;
    message.priceStack = object.priceStack ?? undefined;
    message.durability = object.durability ?? undefined;
    message.maxDurability = object.maxDurability ?? undefined;
    message.maxInInv = object.maxInInv ?? undefined;
    message.stock = object.stock ?? undefined;
    message.usageTime = object.usageTime ?? undefined;
    message.timeBought = object.timeBought ?? undefined;
    message.timeUsed = object.timeUsed ?? undefined;
    return message;
  },
};

function createBaseRemoveActiveItemRequest(): RemoveActiveItemRequest {
  return { userId: "", activeItem: undefined };
}

export const RemoveActiveItemRequest = {
  encode(
    message: RemoveActiveItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.userId !== "") {
      writer.uint32(10).string(message.userId);
    }
    if (message.activeItem !== undefined) {
      ActiveItem.encode(message.activeItem, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveActiveItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveActiveItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.userId = reader.string();
          break;
        case 2:
          message.activeItem = ActiveItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveActiveItemRequest {
    return {
      userId: isSet(object.userId) ? String(object.userId) : "",
      activeItem: isSet(object.activeItem)
        ? ActiveItem.fromJSON(object.activeItem)
        : undefined,
    };
  },

  toJSON(message: RemoveActiveItemRequest): unknown {
    const obj: any = {};
    message.userId !== undefined && (obj.userId = message.userId);
    message.activeItem !== undefined &&
      (obj.activeItem = message.activeItem
        ? ActiveItem.toJSON(message.activeItem)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveActiveItemRequest>, I>>(
    object: I
  ): RemoveActiveItemRequest {
    const message = createBaseRemoveActiveItemRequest();
    message.userId = object.userId ?? "";
    message.activeItem =
      object.activeItem !== undefined && object.activeItem !== null
        ? ActiveItem.fromPartial(object.activeItem)
        : undefined;
    return message;
  },
};

function createBaseRemoveActiveItemResponse(): RemoveActiveItemResponse {
  return {};
}

export const RemoveActiveItemResponse = {
  encode(
    _: RemoveActiveItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveActiveItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveActiveItemResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(_: any): RemoveActiveItemResponse {
    return {};
  },

  toJSON(_: RemoveActiveItemResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveActiveItemResponse>, I>>(
    _: I
  ): RemoveActiveItemResponse {
    const message = createBaseRemoveActiveItemResponse();
    return message;
  },
};

export const EconomyService = {
  getTopTen: {
    path: "/economy.Economy/getTopTen",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetTopTenRequest) =>
      Buffer.from(GetTopTenRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetTopTenRequest.decode(value),
    responseSerialize: (value: GetTopTenResponse) =>
      Buffer.from(GetTopTenResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetTopTenResponse.decode(value),
  },
  getUserData: {
    path: "/economy.Economy/getUserData",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UserDataRequest) =>
      Buffer.from(UserDataRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UserDataRequest.decode(value),
    responseSerialize: (value: UserDataResponse) =>
      Buffer.from(UserDataResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UserDataResponse.decode(value),
  },
  joinGang: {
    path: "/economy.Economy/joinGang",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: JoinGangRequest) =>
      Buffer.from(JoinGangRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => JoinGangRequest.decode(value),
    responseSerialize: (value: JoinGangResponse) =>
      Buffer.from(JoinGangResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => JoinGangResponse.decode(value),
  },
  leaveGang: {
    path: "/economy.Economy/leaveGang",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: LeaveGangRequest) =>
      Buffer.from(LeaveGangRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => LeaveGangRequest.decode(value),
    responseSerialize: (value: LeaveGangResponse) =>
      Buffer.from(LeaveGangResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => LeaveGangResponse.decode(value),
  },
  updateBalance: {
    path: "/economy.Economy/updateBalance",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateBalanceRequest) =>
      Buffer.from(UpdateBalanceRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateBalanceRequest.decode(value),
    responseSerialize: (value: UpdateBalanceResponse) =>
      Buffer.from(UpdateBalanceResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateBalanceResponse.decode(value),
  },
  updateBank: {
    path: "/economy.Economy/updateBank",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateBankRequest) =>
      Buffer.from(UpdateBankRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateBankRequest.decode(value),
    responseSerialize: (value: UpdateBankResponse) =>
      Buffer.from(UpdateBankResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateBankResponse.decode(value),
  },
  updateBankCap: {
    path: "/economy.Economy/updateBankCap",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: UpdateBankCapRequest) =>
      Buffer.from(UpdateBankCapRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => UpdateBankCapRequest.decode(value),
    responseSerialize: (value: UpdateBankCapResponse) =>
      Buffer.from(UpdateBankCapResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => UpdateBankCapResponse.decode(value),
  },
  /** active items */
  getActiveItems: {
    path: "/economy.Economy/getActiveItems",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetActiveItemsRequest) =>
      Buffer.from(GetActiveItemsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetActiveItemsRequest.decode(value),
    responseSerialize: (value: GetActiveItemsResponse) =>
      Buffer.from(GetActiveItemsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      GetActiveItemsResponse.decode(value),
  },
  addActiveItem: {
    path: "/economy.Economy/addActiveItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: AddActiveItemRequest) =>
      Buffer.from(AddActiveItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => AddActiveItemRequest.decode(value),
    responseSerialize: (value: AddActiveItemResponse) =>
      Buffer.from(AddActiveItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => AddActiveItemResponse.decode(value),
  },
  removeActiveItem: {
    path: "/economy.Economy/removeActiveItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: RemoveActiveItemRequest) =>
      Buffer.from(RemoveActiveItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      RemoveActiveItemRequest.decode(value),
    responseSerialize: (value: RemoveActiveItemResponse) =>
      Buffer.from(RemoveActiveItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      RemoveActiveItemResponse.decode(value),
  },
  /** inventory */
  getInventory: {
    path: "/economy.Economy/getInventory",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetInventoryRequest) =>
      Buffer.from(GetInventoryRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetInventoryRequest.decode(value),
    responseSerialize: (value: GetInventoryResponse) =>
      Buffer.from(GetInventoryResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GetInventoryResponse.decode(value),
  },
  addInventoryItem: {
    path: "/economy.Economy/addInventoryItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: AddInventoryItemRequest) =>
      Buffer.from(AddInventoryItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      AddInventoryItemRequest.decode(value),
    responseSerialize: (value: AddInventoryItemResponse) =>
      Buffer.from(AddInventoryItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      AddInventoryItemResponse.decode(value),
  },
  removeInventoryItem: {
    path: "/economy.Economy/removeInventoryItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: RemoveInventoryItemRequest) =>
      Buffer.from(RemoveInventoryItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      RemoveInventoryItemRequest.decode(value),
    responseSerialize: (value: RemoveInventoryItemResponse) =>
      Buffer.from(RemoveInventoryItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      RemoveInventoryItemResponse.decode(value),
  },
  deleteInventoryItem: {
    path: "/economy.Economy/deleteInventoryItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteInventoryItemRequest) =>
      Buffer.from(DeleteInventoryItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteInventoryItemRequest.decode(value),
    responseSerialize: (value: DeleteInventoryItemResponse) =>
      Buffer.from(DeleteInventoryItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteInventoryItemResponse.decode(value),
  },
  deleteInventoryItems: {
    path: "/economy.Economy/deleteInventoryItems",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: DeleteInventoryItemsRequest) =>
      Buffer.from(DeleteInventoryItemsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      DeleteInventoryItemsRequest.decode(value),
    responseSerialize: (value: DeleteInventoryItemsResponse) =>
      Buffer.from(DeleteInventoryItemsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      DeleteInventoryItemsResponse.decode(value),
  },
} as const;

export interface EconomyServer extends UntypedServiceImplementation {
  getTopTen: handleUnaryCall<GetTopTenRequest, GetTopTenResponse>;
  getUserData: handleUnaryCall<UserDataRequest, UserDataResponse>;
  joinGang: handleUnaryCall<JoinGangRequest, JoinGangResponse>;
  leaveGang: handleUnaryCall<LeaveGangRequest, LeaveGangResponse>;
  updateBalance: handleUnaryCall<UpdateBalanceRequest, UpdateBalanceResponse>;
  updateBank: handleUnaryCall<UpdateBankRequest, UpdateBankResponse>;
  updateBankCap: handleUnaryCall<UpdateBankCapRequest, UpdateBankCapResponse>;
  /** active items */
  getActiveItems: handleUnaryCall<
    GetActiveItemsRequest,
    GetActiveItemsResponse
  >;
  addActiveItem: handleUnaryCall<AddActiveItemRequest, AddActiveItemResponse>;
  removeActiveItem: handleUnaryCall<
    RemoveActiveItemRequest,
    RemoveActiveItemResponse
  >;
  /** inventory */
  getInventory: handleUnaryCall<GetInventoryRequest, GetInventoryResponse>;
  addInventoryItem: handleUnaryCall<
    AddInventoryItemRequest,
    AddInventoryItemResponse
  >;
  removeInventoryItem: handleUnaryCall<
    RemoveInventoryItemRequest,
    RemoveInventoryItemResponse
  >;
  deleteInventoryItem: handleUnaryCall<
    DeleteInventoryItemRequest,
    DeleteInventoryItemResponse
  >;
  deleteInventoryItems: handleUnaryCall<
    DeleteInventoryItemsRequest,
    DeleteInventoryItemsResponse
  >;
}

export interface EconomyClient extends Client {
  getTopTen(
    request: GetTopTenRequest,
    callback: (error: ServiceError | null, response: GetTopTenResponse) => void
  ): ClientUnaryCall;
  getTopTen(
    request: GetTopTenRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GetTopTenResponse) => void
  ): ClientUnaryCall;
  getTopTen(
    request: GetTopTenRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GetTopTenResponse) => void
  ): ClientUnaryCall;
  getUserData(
    request: UserDataRequest,
    callback: (error: ServiceError | null, response: UserDataResponse) => void
  ): ClientUnaryCall;
  getUserData(
    request: UserDataRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UserDataResponse) => void
  ): ClientUnaryCall;
  getUserData(
    request: UserDataRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UserDataResponse) => void
  ): ClientUnaryCall;
  joinGang(
    request: JoinGangRequest,
    callback: (error: ServiceError | null, response: JoinGangResponse) => void
  ): ClientUnaryCall;
  joinGang(
    request: JoinGangRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: JoinGangResponse) => void
  ): ClientUnaryCall;
  joinGang(
    request: JoinGangRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: JoinGangResponse) => void
  ): ClientUnaryCall;
  leaveGang(
    request: LeaveGangRequest,
    callback: (error: ServiceError | null, response: LeaveGangResponse) => void
  ): ClientUnaryCall;
  leaveGang(
    request: LeaveGangRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: LeaveGangResponse) => void
  ): ClientUnaryCall;
  leaveGang(
    request: LeaveGangRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: LeaveGangResponse) => void
  ): ClientUnaryCall;
  updateBalance(
    request: UpdateBalanceRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateBalanceResponse
    ) => void
  ): ClientUnaryCall;
  updateBalance(
    request: UpdateBalanceRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateBalanceResponse
    ) => void
  ): ClientUnaryCall;
  updateBalance(
    request: UpdateBalanceRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateBalanceResponse
    ) => void
  ): ClientUnaryCall;
  updateBank(
    request: UpdateBankRequest,
    callback: (error: ServiceError | null, response: UpdateBankResponse) => void
  ): ClientUnaryCall;
  updateBank(
    request: UpdateBankRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: UpdateBankResponse) => void
  ): ClientUnaryCall;
  updateBank(
    request: UpdateBankRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: UpdateBankResponse) => void
  ): ClientUnaryCall;
  updateBankCap(
    request: UpdateBankCapRequest,
    callback: (
      error: ServiceError | null,
      response: UpdateBankCapResponse
    ) => void
  ): ClientUnaryCall;
  updateBankCap(
    request: UpdateBankCapRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: UpdateBankCapResponse
    ) => void
  ): ClientUnaryCall;
  updateBankCap(
    request: UpdateBankCapRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: UpdateBankCapResponse
    ) => void
  ): ClientUnaryCall;
  /** active items */
  getActiveItems(
    request: GetActiveItemsRequest,
    callback: (
      error: ServiceError | null,
      response: GetActiveItemsResponse
    ) => void
  ): ClientUnaryCall;
  getActiveItems(
    request: GetActiveItemsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetActiveItemsResponse
    ) => void
  ): ClientUnaryCall;
  getActiveItems(
    request: GetActiveItemsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetActiveItemsResponse
    ) => void
  ): ClientUnaryCall;
  addActiveItem(
    request: AddActiveItemRequest,
    callback: (
      error: ServiceError | null,
      response: AddActiveItemResponse
    ) => void
  ): ClientUnaryCall;
  addActiveItem(
    request: AddActiveItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: AddActiveItemResponse
    ) => void
  ): ClientUnaryCall;
  addActiveItem(
    request: AddActiveItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: AddActiveItemResponse
    ) => void
  ): ClientUnaryCall;
  removeActiveItem(
    request: RemoveActiveItemRequest,
    callback: (
      error: ServiceError | null,
      response: RemoveActiveItemResponse
    ) => void
  ): ClientUnaryCall;
  removeActiveItem(
    request: RemoveActiveItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: RemoveActiveItemResponse
    ) => void
  ): ClientUnaryCall;
  removeActiveItem(
    request: RemoveActiveItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: RemoveActiveItemResponse
    ) => void
  ): ClientUnaryCall;
  /** inventory */
  getInventory(
    request: GetInventoryRequest,
    callback: (
      error: ServiceError | null,
      response: GetInventoryResponse
    ) => void
  ): ClientUnaryCall;
  getInventory(
    request: GetInventoryRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetInventoryResponse
    ) => void
  ): ClientUnaryCall;
  getInventory(
    request: GetInventoryRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetInventoryResponse
    ) => void
  ): ClientUnaryCall;
  addInventoryItem(
    request: AddInventoryItemRequest,
    callback: (
      error: ServiceError | null,
      response: AddInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  addInventoryItem(
    request: AddInventoryItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: AddInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  addInventoryItem(
    request: AddInventoryItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: AddInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  removeInventoryItem(
    request: RemoveInventoryItemRequest,
    callback: (
      error: ServiceError | null,
      response: RemoveInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  removeInventoryItem(
    request: RemoveInventoryItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: RemoveInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  removeInventoryItem(
    request: RemoveInventoryItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: RemoveInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  deleteInventoryItem(
    request: DeleteInventoryItemRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  deleteInventoryItem(
    request: DeleteInventoryItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  deleteInventoryItem(
    request: DeleteInventoryItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteInventoryItemResponse
    ) => void
  ): ClientUnaryCall;
  deleteInventoryItems(
    request: DeleteInventoryItemsRequest,
    callback: (
      error: ServiceError | null,
      response: DeleteInventoryItemsResponse
    ) => void
  ): ClientUnaryCall;
  deleteInventoryItems(
    request: DeleteInventoryItemsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: DeleteInventoryItemsResponse
    ) => void
  ): ClientUnaryCall;
  deleteInventoryItems(
    request: DeleteInventoryItemsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: DeleteInventoryItemsResponse
    ) => void
  ): ClientUnaryCall;
}

export const EconomyClient = makeGenericClientConstructor(
  EconomyService,
  "economy.Economy"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): EconomyClient;
  service: typeof EconomyService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

function toTimestamp(date: Date): Timestamp {
  const seconds = date.getTime() / 1_000;
  const nanos = (date.getTime() % 1_000) * 1_000_000;
  return { seconds, nanos };
}

function fromTimestamp(t: Timestamp): Date {
  let millis = t.seconds * 1_000;
  millis += t.nanos / 1_000_000;
  return new Date(millis);
}

function fromJsonTimestamp(o: any): Date {
  if (o instanceof Date) {
    return o;
  } else if (typeof o === "string") {
    return new Date(o);
  } else {
    return fromTimestamp(Timestamp.fromJSON(o));
  }
}

function longToNumber(long: Long): number {
  if (long.gt(Number.MAX_SAFE_INTEGER)) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  return long.toNumber();
}

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
