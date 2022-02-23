import { ChannelCredentials } from '@grpc/grpc-js';
import { AddEventRequest, AddEventResponse, EventItem,
  EventsClient, GetEventItemRequest, GetEventItemResponse,
  RemoveEventRequest,
  RemoveEventResponse,
  TimedEvent } from '../../../../generated/events';

export class GrpcEventsClient {
  private readonly shopClient: EventsClient;

  constructor(address: string, credentials: ChannelCredentials) {
    this.shopClient = new EventsClient(address, credentials);
  }

  public async getAllEvents(): Promise<TimedEvent[]> {
    return new Promise((resolve, reject) => {
      this.shopClient.getAllEvents(null, (error, response) => {
        if (error) reject(error);
        resolve(response.events);
      });
    });
  }

  public async getEventItem(eventId: number): Promise<GetEventItemResponse> {
    return new Promise((resolve, reject) => {
      this.shopClient.getEventItem(GetEventItemRequest.fromJSON({ eventId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async addEvent(event: TimedEvent, item: EventItem): Promise<AddEventResponse> {
    return new Promise((resolve, reject) => {
      this.shopClient.addEvent(AddEventRequest.fromJSON({ event, item }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async removeEvent(eventId: number): Promise<RemoveEventResponse> {
    return new Promise((resolve, reject) => {
      this.shopClient.removeEvent(RemoveEventRequest.fromJSON({ eventId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }
}
