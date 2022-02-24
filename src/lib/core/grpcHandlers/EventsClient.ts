import { ChannelCredentials } from '@grpc/grpc-js';
import { AddEventRequest, AddEventResponse, EventsClient,
  RemoveEventRequest, RemoveEventResponse, TimedEvent } from '../../../../generated/events';

export class GrpcEventsClient {
  private readonly eventsClient: EventsClient;

  constructor(address: string, credentials: ChannelCredentials) {
    this.eventsClient = new EventsClient(address, credentials);
  }

  public async getAllEvents(): Promise<TimedEvent[]> {
    return new Promise((resolve, reject) => {
      this.eventsClient.getAllEvents(null, (error, response) => {
        if (error) reject(error);
        resolve(response.events);
      });
    });
  }

  public async addEvent(event: TimedEvent): Promise<AddEventResponse> {
    return new Promise((resolve, reject) => {
      this.eventsClient.addEvent(AddEventRequest.fromJSON({ event }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }

  public async removeEvent(eventId: number): Promise<RemoveEventResponse> {
    return new Promise((resolve, reject) => {
      this.eventsClient.removeEvent(RemoveEventRequest.fromJSON({ eventId }), (error, response) => {
        if (error) reject(error);
        resolve(response);
      });
    });
  }
}
