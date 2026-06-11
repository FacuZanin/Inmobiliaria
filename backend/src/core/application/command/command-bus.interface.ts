// backend/src/core/application/command/command-bus.interface.ts
import type { Command } from './command.base';

export interface ICommandBus {
  execute<TCommand extends Command, TResult>(
    command: TCommand,
  ): Promise<TResult>;
}
