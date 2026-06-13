import { CursorResponse } from '@/core/querying/domain/contracts/cursor-response';
import { CursorToken } from '@/core/querying/domain/ast/pagination/cursor/cursor-token';
import {
  CursorEncoder,
  CursorPayload,
} from '@/core/querying/domain/ast/pagination/cursor/cursor-encoder';
import { CursorQueryExecutionResult } from '../contracts/query-execution-result';

/**
 * Builder para CursorQueryExecutionResult con generación de cursors.
 *
 * ALGORITMO — Detección de hasNextPage sin COUNT(*):
 *
 * El CursorPaginationTranslator pide limit+1 registros.
 * Si llegaron limit+1 registros → hay página siguiente.
 * Si llegaron ≤ limit registros → no hay página siguiente.
 *
 * Se descarta el registro extra antes de construir la respuesta.
 * Esto es el patrón "overfetch by one" — cero queries adicionales
 * para determinar hasNextPage.
 *
 * GENERACIÓN DE CURSORS:
 * El cursor encapsula el valor del campo de sorting + el ID del último item.
 * Esta información es todo lo que el translator necesita para construir
 * el WHERE correcto en el siguiente request.
 *
 * @param items - Raw results incluyendo el extra item (limit+1)
 * @param limit - Límite original de la query (sin el +1)
 * @param sortField - Campo por el que se ordenó (para generar el cursor)
 * @param idField - Nombre del campo ID en los items raw
 */
export class CursorQueryResultBuilder {
  static build<TResult extends Record<string, unknown>>(
    items: readonly TResult[],
    limit: number,
    sortField: string,
    idField: string = 'id',
    previousCursor?: CursorToken,
  ): CursorQueryExecutionResult<TResult> {
    const hasNextPage = items.length > limit;
    const data = hasNextPage ? items.slice(0, limit) : items;

    const nextCursor = hasNextPage
      ? CursorQueryResultBuilder.encodeCursor(
          data[data.length - 1],
          sortField,
          idField,
        )
      : undefined;

    const hasPreviousPage = !!previousCursor;

    const response: CursorResponse<TResult> = {
      data,
      hasNextPage,
      hasPreviousPage,
      nextCursor,
      previousCursor,
    };

    return { type: 'cursor', payload: response };
  }

  private static encodeCursor<TResult extends Record<string, unknown>>(
    item: TResult,
    sortField: string,
    idField: string,
  ): CursorToken {
    const payload: CursorPayload = {
      field: sortField,
      value: item[sortField] as string | number,
      id: item[idField] as string,
    };

    return CursorEncoder.encode(payload);
  }
}
