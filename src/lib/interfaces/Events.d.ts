import { Responder } from '../core';
import { CommandBase } from '../framework';

export interface CommandError {
  command: CommandBase;
  responder: Responder;
  error: any;
}
