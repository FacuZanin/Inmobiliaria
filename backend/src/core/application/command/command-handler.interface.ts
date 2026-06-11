// backend/src/core/application/command/command-handler.interface.ts
import type { Command } from './command.base';
import type { Result } from '../../shared-kernel/result/result';

export interface ICommandHandler<TCommand extends Command, TResult = void> {
  execute(command: TCommand): Promise<Result<TResult>>;
}
