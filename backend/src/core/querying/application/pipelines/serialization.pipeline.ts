import { ExecutionContext } from '../execution/contracts/execution-context';
import { ExecutionStage } from '../execution/contracts/execution-stage';
import { ProjectionSerializer } from '@/core/querying/application/serialization/projection-serializer';
import { QueryExecutionContextFactory } from '../execution/context/query-execution-context';

/**
 * Stage que aplica la proyección a los raw results de la DB.
 *
 * RESPONSABILIDAD:
 * Toma los rawResults del contexto (datos crudos de TypeORM) y los
 * transforma usando la proyección resuelta en ProjectionResolutionStage.
 *
 * ORDEN EN EL PIPELINE: Siempre DESPUÉS de ExecutionStage.
 * El ExecutionStage escribe rawResults, este stage los consume.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué está separado de ExecutionStage:
 *
 * En un sistema con caching, queremos cachear los resultados YA proyectados,
 * no los datos crudos. Separar execution de serialization permite:
 *
 * 1. CacheReadStage antes de MaterializationStage: si hay hit, retorna
 *    los datos ya proyectados directamente (no necesita ejecutar la DB).
 *
 * 2. CacheWriteStage después de MaterializationStage: escribe los datos
 *    ya proyectados — el siguiente request no necesita reproyectar.
 *
 * Si mezcláramos execution y serialization, el cache guardaría datos crudos
 * y tendríamos que volver a proyectar en cada cache hit (costoso e inconsistente).
 *
 * ANTI-PATTERN QUE EVITAMOS:
 * No hay lógica de "qué tipo de resultado es" aquí. Este stage no sabe
 * si es paginated o cursor — solo sabe serializar una lista de items.
 * La estructura de respuesta (PaginatedResponse, CursorResponse) se construye
 * en el executor concreto.
 */
export class SerializationStage<
  TField extends string = string,
  TExecutionPlan = unknown,
> implements ExecutionStage<TField, TExecutionPlan> {
  readonly name = 'serialization';

  constructor(
    private readonly serializer: ProjectionSerializer,
  ) {}

  async execute(
    context: ExecutionContext<TField, TExecutionPlan>,
  ): Promise<ExecutionContext<TField, TExecutionPlan>> {
    const { rawResults, projection } = context;

    if (!rawResults) {
      throw new SerializationStageError(
        'SerializationStage requires rawResults in context. ' +
        'Ensure ExecutionStage runs before SerializationStage.',
      );
    }

    if (!projection) {
      throw new SerializationStageError(
        'SerializationStage requires projection in context. ' +
        'Ensure ProjectionResolutionStage runs before SerializationStage.',
      );
    }

    const projected = rawResults.map((raw) =>
      this.serializer.serialize(projection, raw),
    );

    return QueryExecutionContextFactory.enrich(
      context,
      { rawResults: projected },
      this.name,
    );
  }
}

export class SerializationStageError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SerializationStageError';
  }
}
