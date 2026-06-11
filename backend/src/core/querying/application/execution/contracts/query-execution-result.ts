import { PaginatedResponse } from '@/core/application/pagination/paginated.response';
import { CursorResponse } from '@/core/querying/domain/contracts/cursor-response';

/**
 * Resultado discriminado de la ejecución de una query.
 *
 * DECISIÓN ARQUITECTÓNICA — Discriminated Union vs Generics:
 *
 * En vez de un tipo genérico que puede ser cualquier cosa,
 * usamos un discriminated union. Esto fuerza al caller a
 * hacer pattern matching explícito — no puede acceder a
 * `.data` sin verificar primero de qué tipo es el resultado.
 *
 * Esto elimina toda una clase de bugs donde el caller asume
 * que el resultado es paginado cuando en realidad es cursor, etc.
 */
export type QueryExecutionResult<TResult> =
  | PaginatedQueryExecutionResult<TResult>
  | CursorQueryExecutionResult<TResult>
  | SingleQueryExecutionResult<TResult>;

export interface PaginatedQueryExecutionResult<TResult> {
  readonly type: 'paginated';
  readonly payload: PaginatedResponse<TResult>;
}

export interface CursorQueryExecutionResult<TResult> {
  readonly type: 'cursor';
  readonly payload: CursorResponse<TResult>;
}

export interface SingleQueryExecutionResult<TResult> {
  readonly type: 'single';
  readonly payload: TResult;
}

// Type guards — el caller puede usarlos para narrowing seguro
export function isPaginatedResult<T>(
  result: QueryExecutionResult<T>,
): result is PaginatedQueryExecutionResult<T> {
  return result.type === 'paginated';
}

export function isCursorResult<T>(
  result: QueryExecutionResult<T>,
): result is CursorQueryExecutionResult<T> {
  return result.type === 'cursor';
}

export function isSingleResult<T>(
  result: QueryExecutionResult<T>,
): result is SingleQueryExecutionResult<T> {
  return result.type === 'single';
}