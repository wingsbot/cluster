export interface TimedEvent {
  id?: number;
  time: number;
  type: string;
  guildId?: string;
  userId?: string;
  itemId: number;
}
