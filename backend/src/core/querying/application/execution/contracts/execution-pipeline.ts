import { ExecutionContext } from './execution-context';

/**
 * Orquestador del pipeline de ejecución de queries.
 *
 * DECISIÓN ARQUITECTÓNICA:
 * El pipeline es el único punto de entrada al subsistema de ejecución.
 * NADA del código externo debe invocar stages directamente.
 *
 * Los ejecutors concretos (TypeOrmPaginatedQueryExecutor, etc.) reciben
 * el pipeline como dependencia y lo invocan con su contexto inicial.
 *
 * Esto garantiza que:
 * 1. La validación SIEMPRE ocurre (no se puede saltear)
 * 2. El caching SIEMPRE se intenta (no hay bypass accidental)
 * 3. Los stages se pueden reordenar en un solo lugar
 * 4. Podemos inyectar stages de testing (mock execution stage)
 */
export interface ExecutionPipeline<
  TField extends string = string,
  TExecutionPlan = unknown,
> {
  /**
   * Ejecuta todos los stages en orden y retorna el contexto final.
   *
   * El contexto final contiene rawResults ya materializados.
   * El caller (executor) extrae el resultado tipado del contexto.
   */
  execute(
    context: ExecutionContext<TField, TExecutionPlan>,
  ): Promise<ExecutionContext<TField, TExecutionPlan>>;
}
