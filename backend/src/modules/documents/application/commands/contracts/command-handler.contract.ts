// backend\src\modules\documents\application\commands\contracts\command-handler.contract.ts
export interface CommandHandler<
  TCommand,
  TResult,
> {
  execute(command: TCommand): Promise<TResult>;
}