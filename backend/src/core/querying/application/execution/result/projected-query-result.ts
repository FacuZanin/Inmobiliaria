import { SingleQueryExecutionResult } from '../contracts/query-execution-result';

/**
 * Wrapper para resultados de queries no paginadas.
 * Usado para queries de detalle (find-by-id) o aggregations.
 */
export class ProjectedQueryResultBuilder {
  static buildSingle<TResult>(
    data: TResult,
  ): SingleQueryExecutionResult<TResult> {
    return { type: 'single', payload: data };
  }

  static buildList<TResult>(
    data: readonly TResult[],
  ): SingleQueryExecutionResult<readonly TResult[]> {
    return { type: 'single', payload: data };
  }
}
