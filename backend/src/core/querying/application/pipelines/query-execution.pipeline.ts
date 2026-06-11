import { ExecutionContext } from '../contracts/execution-context';
import { ExecutionPipeline } from '../contracts/execution-pipeline';
import { ExecutionStage } from '../contracts/execution-stage';

/**
 * Implementación del pipeline de ejecución de queries.
 *
 * DECISIÓN ARQUITECTÓNICA — Ordered Stage Pipeline:
 *
 * El pipeline ejecuta los stages en el orden en que fueron registrados.
 * Cada stage recibe el contexto enriquecido por el stage anterior.
 *
 * Si un stage lanza una excepción:
 * 1. El pipeline aborta inmediatamente (no ejecuta stages siguientes)
 * 2. La excepción se propaga al caller (el executor)
 * 3. El executor puede hacer cleanup si necesita (release de QB, etc.)
 *
 * EXTENSIBILIDAD:
 * Nuevos stages se agregan sin tocar el pipeline.
 * El orden es responsabilidad del módulo que configura el pipeline.
 *
 * @example en un NestJS module:
 *   const pipeline = new QueryExecutionPipeline([
 *     new ValidationStage(registry),
 *     new CacheReadStage(cache),
 *     new ProjectionResolutionStage(projectionRegistry),
 *     new TypeOrmTranslationStage(queryBuilder, registry),
 *     new TypeOrmExecutionStage(),
 *     new MaterializationStage(serializer),
 *     new CacheWriteStage(cache),
 *   ]);
 */
export class QueryExecutionPipeline<
  TField extends string = string,
  TExecutionPlan = unknown,
> implements ExecutionPipeline<TField, TExecutionPlan> {
  constructor(
    private readonly stages: readonly ExecutionStage<TField, TExecutionPlan>[],
  ) {}

  async execute(
    initialContext: ExecutionContext<TField, TExecutionPlan>,
  ): Promise<ExecutionContext<TField, TExecutionPlan>> {
    let context = initialContext;

    for (const stage of this.stages) {
      context = await stage.execute(context);
    }

    return context;
  }
}