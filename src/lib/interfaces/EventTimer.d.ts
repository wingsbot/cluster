export interface TimedEvent {
  id?: number;
  time: string;
  type: string;
  guildId?: string;
  userId?: string;
  itemId: number;
}
