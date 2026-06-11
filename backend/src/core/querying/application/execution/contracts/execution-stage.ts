import { ExecutionContext } from './execution-context';

/**
 * Contrato para un stage del pipeline de ejecución.
 *
 * DECISIÓN ARQUITECTÓNICA — Pipeline Pattern:
 *
 * El pipeline de ejecución de queries sigue el patrón Chain of Responsibility
 * con una diferencia crucial: cada stage puede tanto transformar el contexto
 * como producir un resultado final (short-circuit).
 *
 * Orden típico del pipeline:
 * 1. ValidationStage      — valida el query AST
 * 2. CacheResolutionStage — intenta servir desde cache
 * 3. ProjectionStage      — resuelve la proyección activa
 * 4. TranslationStage     — AST → execution plan (TypeORM QB)
 * 5. ExecutionStage       — ejecuta contra la DB
 * 6. MaterializationStage — aplica proyección + serialización
 * 7. CacheWriteStage      — escribe resultado en cache
 *
 * VENTAJA: Podemos insertar CachingStage entre ValidationStage y
 * TranslationStage — si hay cache hit, saltamos la DB completamente.
 * Esto es imposible de hacer limpiamente con una service layer monolítica.
 *
 * IMMUTABILIDAD: execute() retorna un NUEVO contexto enriquecido.
 * No mutar el contexto recibido.
 */
export interface ExecutionStage<
  TField extends string = string,
  TExecutionPlan = unknown,
> {
  /**
   * Nombre del stage para logging/tracing/metrics.
   * Debe ser único y descriptivo: 'validation', 'cache-read', etc.
   */
  readonly name: string;

  /**
   * Ejecuta el stage y retorna el contexto enriquecido.
   *
   * @param context - Contexto actual del pipeline
   * @returns Contexto enriquecido con el output de este stage
   *
   * Los stages pueden lanzar excepciones para abortar el pipeline.
   * Las excepciones deben ser semánticas (InvalidQueryException, etc.)
   * no errores de infraestructura crudos.
   */
  execute(
    context: ExecutionContext<TField, TExecutionPlan>,
  ): Promise<ExecutionContext<TField, TExecutionPlan>>;
}