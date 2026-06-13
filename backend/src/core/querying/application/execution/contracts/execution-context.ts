import { QueryContext } from '@/core/querying/domain/ast/query/query-context';
import { QueryNode } from '@/core/querying/domain/ast/query/query-node';
import { TranslatedQueryResult } from '@/core/querying/application/execution/result/translated-query-result';
import { Projection } from '@/core/querying/domain/projections/projection';

/**
 * Contexto inmutable que fluye a través del pipeline de ejecución.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué un context object y no parámetros sueltos:
 *
 * El pipeline tiene N stages. Si cada stage necesita 5 parámetros,
 * agregar un 6to parámetro rompe la firma de TODOS los stages.
 * Un context object es extensible sin breaking changes.
 *
 * INMUTABILIDAD: Cada stage puede "enriquecer" el contexto retornando
 * un nuevo objeto. Nunca mutar el contexto recibido.
 *
 * TIPO GENÉRICO TExecutionPlan:
 * El plan de ejecución varía por infrastructure (TypeORM SelectQueryBuilder,
 * Elasticsearch DSL, Prisma query, etc). El contexto es agnóstico.
 */
export interface ExecutionContext<
  TField extends string = string,
  TExecutionPlan = unknown,
> {
  /**
   * El query AST original — inmutable, no modificar en ningún stage.
   * Cada stage trabaja sobre este AST para derivar su propio output.
   */
  readonly queryNode: QueryNode<TField>;

  /**
   * Contexto de seguridad/tenant del request.
   * Disponible en todos los stages para aplicar row-level security.
   */
  readonly queryContext?: QueryContext;

  /**
   * El plan de ejecución traducido (disponible después del translation stage).
   * Undefined antes de que el TranslationStage lo produzca.
   */
  readonly translatedQuery?: TranslatedQueryResult<TExecutionPlan>;

  /**
   * La proyección activa (disponible después del projection resolution stage).
   * Si no se especificó proyección, es la proyección default del recurso.
   */
  readonly projection?: Projection<unknown>;

  /**
   * Raw results de la base de datos (disponible después del execution stage).
   * Son datos crudos — aún no proyectados ni serializados.
   */
  readonly rawResults?: unknown[];

  /**
   * Total count para paginación por offset.
   * Solo presente si la query usa OffsetPagination y se requirió count.
   */
  readonly totalCount?: number;

  /**
   * Metadatos de ejecución para observabilidad y debugging.
   */
  readonly metadata: ExecutionContextMetadata;
}

export interface ExecutionContextMetadata {
  readonly requestId?: string;
  readonly startedAt: Date;
  readonly stages: readonly string[];
  readonly cacheHit?: boolean;
  readonly cacheKey?: string;
}
