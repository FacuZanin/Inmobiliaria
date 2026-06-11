// backend/src/core/application/use-case/use-case.base.ts
import type { Result } from '../../shared-kernel/result/result';

// UseCase base para lógica de aplicación que no encaja limpiamente
// en un CommandHandler (ej: coordinación de múltiples comandos,
// orquestación de sagas simples, lógica de validación compleja).
export abstract class UseCase<TInput, TOutput> {
  abstract execute(input: TInput): Promise<Result<TOutput>>;
}
