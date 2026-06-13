import { Injectable, Logger } from '@nestjs/common';
import { QueryRequest } from '@/core/querying/domain/contracts/query-request';
import { QueryExecutor } from '../contracts/query-executor';
import { QueryExecutionResult } from '../contracts/query-execution-result';
import { QueryExecutionMetadataBuilder } from '../context/query-execution-metadata';

/**
 * Servicio NestJS que actúa como facade del sistema de ejecución de queries.
 *
 * PROPÓSITO:
 * Este servicio NO contiene lógica de querying. Solo:
 * 1. Wrappea la ejecución con logging y observabilidad
 * 2. Maneja errores de infraestructura vs errores de dominio
 * 3. Emite métricas (duración, cache hit rate, error rate)
 *
 * DECISIÓN ARQUITECTÓNICA — Facade vs Service Layer:
 * NO es un "service layer" tradicional que orquesta múltiples repositories.
 * Es un facade de infraestructura que agrega cross-cutting concerns
 * (logging, metrics, error handling) sin mezclarlos con la lógica de query.
 *
 * La lógica vive en los executors. Este servicio solo los llama y observa.
 *
 * INYECCIÓN:
 * Los QueryHandlers del CQRS read-side inyectan este servicio
 * junto con su executor concreto. El servicio coordina la ejecución
 * independientemente de qué executor se use.
 */
@Injectable()
export class QueryExecutionService {
  private readonly logger = new Logger(QueryExecutionService.name);

  async execute<TField extends string, TResult>(
    executor: QueryExecutor<TField, TResult>,
    request: QueryRequest<TField>,
  ): Promise<QueryExecutionResult<TResult>> {
    const metaBuilder = new QueryExecutionMetadataBuilder();
    const requestId = request.context?.requestId ?? 'unknown';

    this.logger.debug(`[${requestId}] Starting query execution`);

    try {
      const result = await executor.execute(request);

      const metadata = metaBuilder.build(requestId);

      this.logger.debug(
        `[${requestId}] Query completed in ${metadata.durationMs}ms ` +
          `| cache: ${metadata.cacheHit ? 'HIT' : 'MISS'} ` +
          `| type: ${result.type}`,
      );

      return result;
    } catch (error) {
      const metadata = metaBuilder.build(requestId);

      this.logger.error(
        `[${requestId}] Query failed after ${metadata.durationMs}ms`,
        error instanceof Error ? error.stack : String(error),
      );

      throw error;
    }
  }
}
