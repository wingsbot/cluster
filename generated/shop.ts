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

export const protobufPackage = "shop";

export interface GetSpecialItemsRequest {}

export interface GetSpecialItemsResponse {
  specialItems: SpecialItem[];
}

export interface AddSpecialItemRequest {
  item: SpecialItem | undefined;
}

export interface AddSpecialItemResponse {
  id: number;
  itemId: string;
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
  timeBought?: number | undefined;
  timeUsed?: number | undefined;
}

export interface RemoveSpecialItemRequest {
  item: SpecialItem | undefined;
}

export interface RemoveSpecialItemResponse {}

export interface SpecialItem {
  id?: number | undefined;
  itemId: string;
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
  timeBought?: number | undefined;
  timeUsed?: number | undefined;
}

function createBaseGetSpecialItemsRequest(): GetSpecialItemsRequest {
  return {};
}

export const GetSpecialItemsRequest = {
  encode(
    _: GetSpecialItemsRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetSpecialItemsRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSpecialItemsRequest();
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

  fromJSON(_: any): GetSpecialItemsRequest {
    return {};
  },

  toJSON(_: GetSpecialItemsRequest): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSpecialItemsRequest>, I>>(
    _: I
  ): GetSpecialItemsRequest {
    const message = createBaseGetSpecialItemsRequest();
    return message;
  },
};

function createBaseGetSpecialItemsResponse(): GetSpecialItemsResponse {
  return { specialItems: [] };
}

export const GetSpecialItemsResponse = {
  encode(
    message: GetSpecialItemsResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    for (const v of message.specialItems) {
      SpecialItem.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): GetSpecialItemsResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetSpecialItemsResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.specialItems.push(
            SpecialItem.decode(reader, reader.uint32())
          );
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSpecialItemsResponse {
    return {
      specialItems: Array.isArray(object?.specialItems)
        ? object.specialItems.map((e: any) => SpecialItem.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetSpecialItemsResponse): unknown {
    const obj: any = {};
    if (message.specialItems) {
      obj.specialItems = message.specialItems.map((e) =>
        e ? SpecialItem.toJSON(e) : undefined
      );
    } else {
      obj.specialItems = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSpecialItemsResponse>, I>>(
    object: I
  ): GetSpecialItemsResponse {
    const message = createBaseGetSpecialItemsResponse();
    message.specialItems =
      object.specialItems?.map((e) => SpecialItem.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAddSpecialItemRequest(): AddSpecialItemRequest {
  return { item: undefined };
}

export const AddSpecialItemRequest = {
  encode(
    message: AddSpecialItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.item !== undefined) {
      SpecialItem.encode(message.item, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AddSpecialItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddSpecialItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.item = SpecialItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddSpecialItemRequest {
    return {
      item: isSet(object.item) ? SpecialItem.fromJSON(object.item) : undefined,
    };
  },

  toJSON(message: AddSpecialItemRequest): unknown {
    const obj: any = {};
    message.item !== undefined &&
      (obj.item = message.item ? SpecialItem.toJSON(message.item) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddSpecialItemRequest>, I>>(
    object: I
  ): AddSpecialItemRequest {
    const message = createBaseAddSpecialItemRequest();
    message.item =
      object.item !== undefined && object.item !== null
        ? SpecialItem.fromPartial(object.item)
        : undefined;
    return message;
  },
};

function createBaseAddSpecialItemResponse(): AddSpecialItemResponse {
  return {
    id: 0,
    itemId: "",
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

export const AddSpecialItemResponse = {
  encode(
    message: AddSpecialItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== 0) {
      writer.uint32(9).fixed64(message.id);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.price !== 0) {
      writer.uint32(41).fixed64(message.price);
    }
    if (message.canBeSold === true) {
      writer.uint32(48).bool(message.canBeSold);
    }
    if (message.replyMessage !== "") {
      writer.uint32(58).string(message.replyMessage);
    }
    if (message.count !== 0) {
      writer.uint32(64).uint64(message.count);
    }
    if (message.useable === true) {
      writer.uint32(72).bool(message.useable);
    }
    if (message.powerUp !== undefined) {
      writer.uint32(80).bool(message.powerUp);
    }
    if (message.cooldownBetweenPurchase !== undefined) {
      writer.uint32(89).fixed64(message.cooldownBetweenPurchase);
    }
    if (message.priceStack !== undefined) {
      writer.uint32(96).bool(message.priceStack);
    }
    if (message.durability !== undefined) {
      writer.uint32(104).uint64(message.durability);
    }
    if (message.maxDurability !== undefined) {
      writer.uint32(112).uint64(message.maxDurability);
    }
    if (message.maxInInv !== undefined) {
      writer.uint32(121).fixed64(message.maxInInv);
    }
    if (message.stock !== undefined) {
      writer.uint32(129).fixed64(message.stock);
    }
    if (message.usageTime !== undefined) {
      writer.uint32(137).fixed64(message.usageTime);
    }
    if (message.timeBought !== undefined) {
      writer.uint32(145).fixed64(message.timeBought);
    }
    if (message.timeUsed !== undefined) {
      writer.uint32(153).fixed64(message.timeUsed);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): AddSpecialItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddSpecialItemResponse();
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
          message.name = reader.string();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.price = longToNumber(reader.fixed64() as Long);
          break;
        case 6:
          message.canBeSold = reader.bool();
          break;
        case 7:
          message.replyMessage = reader.string();
          break;
        case 8:
          message.count = longToNumber(reader.uint64() as Long);
          break;
        case 9:
          message.useable = reader.bool();
          break;
        case 10:
          message.powerUp = reader.bool();
          break;
        case 11:
          message.cooldownBetweenPurchase = longToNumber(
            reader.fixed64() as Long
          );
          break;
        case 12:
          message.priceStack = reader.bool();
          break;
        case 13:
          message.durability = longToNumber(reader.uint64() as Long);
          break;
        case 14:
          message.maxDurability = longToNumber(reader.uint64() as Long);
          break;
        case 15:
          message.maxInInv = longToNumber(reader.fixed64() as Long);
          break;
        case 16:
          message.stock = longToNumber(reader.fixed64() as Long);
          break;
        case 17:
          message.usageTime = longToNumber(reader.fixed64() as Long);
          break;
        case 18:
          message.timeBought = longToNumber(reader.fixed64() as Long);
          break;
        case 19:
          message.timeUsed = longToNumber(reader.fixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AddSpecialItemResponse {
    return {
      id: isSet(object.id) ? Number(object.id) : 0,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
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
        ? Number(object.timeBought)
        : undefined,
      timeUsed: isSet(object.timeUsed) ? Number(object.timeUsed) : undefined,
    };
  },

  toJSON(message: AddSpecialItemResponse): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.itemId !== undefined && (obj.itemId = message.itemId);
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
      (obj.timeBought = Math.round(message.timeBought));
    message.timeUsed !== undefined &&
      (obj.timeUsed = Math.round(message.timeUsed));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AddSpecialItemResponse>, I>>(
    object: I
  ): AddSpecialItemResponse {
    const message = createBaseAddSpecialItemResponse();
    message.id = object.id ?? 0;
    message.itemId = object.itemId ?? "";
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

function createBaseRemoveSpecialItemRequest(): RemoveSpecialItemRequest {
  return { item: undefined };
}

export const RemoveSpecialItemRequest = {
  encode(
    message: RemoveSpecialItemRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.item !== undefined) {
      SpecialItem.encode(message.item, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveSpecialItemRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveSpecialItemRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.item = SpecialItem.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RemoveSpecialItemRequest {
    return {
      item: isSet(object.item) ? SpecialItem.fromJSON(object.item) : undefined,
    };
  },

  toJSON(message: RemoveSpecialItemRequest): unknown {
    const obj: any = {};
    message.item !== undefined &&
      (obj.item = message.item ? SpecialItem.toJSON(message.item) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveSpecialItemRequest>, I>>(
    object: I
  ): RemoveSpecialItemRequest {
    const message = createBaseRemoveSpecialItemRequest();
    message.item =
      object.item !== undefined && object.item !== null
        ? SpecialItem.fromPartial(object.item)
        : undefined;
    return message;
  },
};

function createBaseRemoveSpecialItemResponse(): RemoveSpecialItemResponse {
  return {};
}

export const RemoveSpecialItemResponse = {
  encode(
    _: RemoveSpecialItemResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): RemoveSpecialItemResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseRemoveSpecialItemResponse();
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

  fromJSON(_: any): RemoveSpecialItemResponse {
    return {};
  },

  toJSON(_: RemoveSpecialItemResponse): unknown {
    const obj: any = {};
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RemoveSpecialItemResponse>, I>>(
    _: I
  ): RemoveSpecialItemResponse {
    const message = createBaseRemoveSpecialItemResponse();
    return message;
  },
};

function createBaseSpecialItem(): SpecialItem {
  return {
    id: undefined,
    itemId: "",
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

export const SpecialItem = {
  encode(
    message: SpecialItem,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.id !== undefined) {
      writer.uint32(9).fixed64(message.id);
    }
    if (message.itemId !== "") {
      writer.uint32(18).string(message.itemId);
    }
    if (message.name !== "") {
      writer.uint32(26).string(message.name);
    }
    if (message.description !== "") {
      writer.uint32(34).string(message.description);
    }
    if (message.price !== 0) {
      writer.uint32(41).fixed64(message.price);
    }
    if (message.canBeSold === true) {
      writer.uint32(48).bool(message.canBeSold);
    }
    if (message.replyMessage !== "") {
      writer.uint32(58).string(message.replyMessage);
    }
    if (message.count !== 0) {
      writer.uint32(64).uint64(message.count);
    }
    if (message.useable === true) {
      writer.uint32(72).bool(message.useable);
    }
    if (message.powerUp !== undefined) {
      writer.uint32(80).bool(message.powerUp);
    }
    if (message.cooldownBetweenPurchase !== undefined) {
      writer.uint32(89).fixed64(message.cooldownBetweenPurchase);
    }
    if (message.priceStack !== undefined) {
      writer.uint32(96).bool(message.priceStack);
    }
    if (message.durability !== undefined) {
      writer.uint32(104).uint64(message.durability);
    }
    if (message.maxDurability !== undefined) {
      writer.uint32(112).uint64(message.maxDurability);
    }
    if (message.maxInInv !== undefined) {
      writer.uint32(121).fixed64(message.maxInInv);
    }
    if (message.stock !== undefined) {
      writer.uint32(129).fixed64(message.stock);
    }
    if (message.usageTime !== undefined) {
      writer.uint32(137).fixed64(message.usageTime);
    }
    if (message.timeBought !== undefined) {
      writer.uint32(145).fixed64(message.timeBought);
    }
    if (message.timeUsed !== undefined) {
      writer.uint32(153).fixed64(message.timeUsed);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SpecialItem {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSpecialItem();
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
          message.name = reader.string();
          break;
        case 4:
          message.description = reader.string();
          break;
        case 5:
          message.price = longToNumber(reader.fixed64() as Long);
          break;
        case 6:
          message.canBeSold = reader.bool();
          break;
        case 7:
          message.replyMessage = reader.string();
          break;
        case 8:
          message.count = longToNumber(reader.uint64() as Long);
          break;
        case 9:
          message.useable = reader.bool();
          break;
        case 10:
          message.powerUp = reader.bool();
          break;
        case 11:
          message.cooldownBetweenPurchase = longToNumber(
            reader.fixed64() as Long
          );
          break;
        case 12:
          message.priceStack = reader.bool();
          break;
        case 13:
          message.durability = longToNumber(reader.uint64() as Long);
          break;
        case 14:
          message.maxDurability = longToNumber(reader.uint64() as Long);
          break;
        case 15:
          message.maxInInv = longToNumber(reader.fixed64() as Long);
          break;
        case 16:
          message.stock = longToNumber(reader.fixed64() as Long);
          break;
        case 17:
          message.usageTime = longToNumber(reader.fixed64() as Long);
          break;
        case 18:
          message.timeBought = longToNumber(reader.fixed64() as Long);
          break;
        case 19:
          message.timeUsed = longToNumber(reader.fixed64() as Long);
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SpecialItem {
    return {
      id: isSet(object.id) ? Number(object.id) : undefined,
      itemId: isSet(object.itemId) ? String(object.itemId) : "",
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
        ? Number(object.timeBought)
        : undefined,
      timeUsed: isSet(object.timeUsed) ? Number(object.timeUsed) : undefined,
    };
  },

  toJSON(message: SpecialItem): unknown {
    const obj: any = {};
    message.id !== undefined && (obj.id = Math.round(message.id));
    message.itemId !== undefined && (obj.itemId = message.itemId);
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
      (obj.timeBought = Math.round(message.timeBought));
    message.timeUsed !== undefined &&
      (obj.timeUsed = Math.round(message.timeUsed));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SpecialItem>, I>>(
    object: I
  ): SpecialItem {
    const message = createBaseSpecialItem();
    message.id = object.id ?? undefined;
    message.itemId = object.itemId ?? "";
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

export const ShopService = {
  getSpecialItems: {
    path: "/shop.Shop/getSpecialItems",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: GetSpecialItemsRequest) =>
      Buffer.from(GetSpecialItemsRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => GetSpecialItemsRequest.decode(value),
    responseSerialize: (value: GetSpecialItemsResponse) =>
      Buffer.from(GetSpecialItemsResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      GetSpecialItemsResponse.decode(value),
  },
  addSpecialItem: {
    path: "/shop.Shop/addSpecialItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: AddSpecialItemRequest) =>
      Buffer.from(AddSpecialItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => AddSpecialItemRequest.decode(value),
    responseSerialize: (value: AddSpecialItemResponse) =>
      Buffer.from(AddSpecialItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      AddSpecialItemResponse.decode(value),
  },
  removeSpecialItem: {
    path: "/shop.Shop/removeSpecialItem",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: RemoveSpecialItemRequest) =>
      Buffer.from(RemoveSpecialItemRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) =>
      RemoveSpecialItemRequest.decode(value),
    responseSerialize: (value: RemoveSpecialItemResponse) =>
      Buffer.from(RemoveSpecialItemResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) =>
      RemoveSpecialItemResponse.decode(value),
  },
} as const;

export interface ShopServer extends UntypedServiceImplementation {
  getSpecialItems: handleUnaryCall<
    GetSpecialItemsRequest,
    GetSpecialItemsResponse
  >;
  addSpecialItem: handleUnaryCall<
    AddSpecialItemRequest,
    AddSpecialItemResponse
  >;
  removeSpecialItem: handleUnaryCall<
    RemoveSpecialItemRequest,
    RemoveSpecialItemResponse
  >;
}

export interface ShopClient extends Client {
  getSpecialItems(
    request: GetSpecialItemsRequest,
    callback: (
      error: ServiceError | null,
      response: GetSpecialItemsResponse
    ) => void
  ): ClientUnaryCall;
  getSpecialItems(
    request: GetSpecialItemsRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: GetSpecialItemsResponse
    ) => void
  ): ClientUnaryCall;
  getSpecialItems(
    request: GetSpecialItemsRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: GetSpecialItemsResponse
    ) => void
  ): ClientUnaryCall;
  addSpecialItem(
    request: AddSpecialItemRequest,
    callback: (
      error: ServiceError | null,
      response: AddSpecialItemResponse
    ) => void
  ): ClientUnaryCall;
  addSpecialItem(
    request: AddSpecialItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: AddSpecialItemResponse
    ) => void
  ): ClientUnaryCall;
  addSpecialItem(
    request: AddSpecialItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: AddSpecialItemResponse
    ) => void
  ): ClientUnaryCall;
  removeSpecialItem(
    request: RemoveSpecialItemRequest,
    callback: (
      error: ServiceError | null,
      response: RemoveSpecialItemResponse
    ) => void
  ): ClientUnaryCall;
  removeSpecialItem(
    request: RemoveSpecialItemRequest,
    metadata: Metadata,
    callback: (
      error: ServiceError | null,
      response: RemoveSpecialItemResponse
    ) => void
  ): ClientUnaryCall;
  removeSpecialItem(
    request: RemoveSpecialItemRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (
      error: ServiceError | null,
      response: RemoveSpecialItemResponse
    ) => void
  ): ClientUnaryCall;
}

export const ShopClient = makeGenericClientConstructor(
  ShopService,
  "shop.Shop"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): ShopClient;
  service: typeof ShopService;
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
