import { QueryRequest } from '@/core/querying/domain/contracts/query-request';
import { QueryExecutionResult } from './query-execution-result';

/**
 * Contrato público del sistema de ejecución de queries.
 *
 * DECISIÓN ARQUITECTÓNICA — QueryExecutor como puerto de infraestructura:
 *
 * QueryExecutor es el puerto (en términos de Ports & Adapters) que separa
 * la capa de aplicación de la infraestructura de querying.
 *
 * Los QueryHandlers del lado read (CQRS) reciben un QueryExecutor como
 * dependencia — nunca un TypeORM Repository directamente.
 *
 * Esto permite:
 * 1. Testear QueryHandlers sin levantar una DB real
 * 2. Cambiar la implementación (TypeORM → Prisma → Elasticsearch) sin
 *    tocar los handlers
 * 3. Decorar el executor con caching, circuit-breaking, etc.
 *
 * @example
 *   // En un QueryHandler de NestJS:
 *   @QueryHandler(ListPropertiesQuery)
 *   export class ListPropertiesHandler {
 *     constructor(
 *       @Inject(PROPERTY_QUERY_EXECUTOR)
 *       private readonly executor: QueryExecutor<PropertyField, PropertyDto>,
 *     ) {}
 *
 *     async execute(query: ListPropertiesQuery) {
 *       return this.executor.execute({
 *         query: query.toQueryNode(),
 *         context: query.context,
 *       });
 *     }
 *   }
 */
export interface QueryExecutor<
  TField extends string = string,
  TResult = unknown,
> {
  execute(
    request: QueryRequest<TField>,
  ): Promise<QueryExecutionResult<TResult>>;
}

/**
 * Token de inyección de dependencias para NestJS.
 * Cada dominio define su propio token.
 *
 * @example
 *   export const PROPERTY_QUERY_EXECUTOR = Symbol('PROPERTY_QUERY_EXECUTOR');
 */
export type QueryExecutorToken = symbol | string;
