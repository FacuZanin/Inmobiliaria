import { PaginatedResponse, buildPaginationMeta, } from '@/core/application/pagination/paginated.response';
import { PaginatedQueryExecutionResult } from '../contracts/query-execution-result';

/**
 * Builder para PaginatedQueryExecutionResult.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué un builder y no un constructor:
 * El resultado de paginación requiere calcular totalPages, hasNextPage, etc.
 * Un builder hace estos cálculos explícitos y testeable en un solo lugar.
 *
 * SEGURIDAD: El total viene de un COUNT(*) separado, nunca de data.length.
 * Si count viene de la misma query que los datos, puede haber inconsistencias
 * en sistemas con alta concurrencia de escritura.
 */
export class PaginatedQueryResultBuilder {
  static build<TResult>(
    data: readonly TResult[],
    total: number,
    page: number,
    limit: number,
  ): PaginatedQueryExecutionResult<TResult> {
    const response: PaginatedResponse<TResult> = {
      data,
      meta: buildPaginationMeta(
        total,
        {
          page,
          limit,
        },
      ),
    };

    return {
      type: 'paginated',
      payload: response,
    };
  }
}
