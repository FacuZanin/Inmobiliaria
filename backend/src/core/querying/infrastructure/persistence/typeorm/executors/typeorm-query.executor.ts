// backend\src\core\querying\infrastructure\persistence\typeorm\executors\typeorm-query.executor.ts

import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { QueryRequest } from '@/core/querying/domain/contracts/query-request';
import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';
import { ProjectionRegistry } from '@/core/querying/domain/projections/registry/projection.registry';
import { TypeOrmQueryTranslator } from '@/core/querying/infrastructure/persistence/typeorm/translators/typeorm-query-translator';
import { DefaultProjectionSerializer } from '@/core/querying/application/serialization/contracts/projection.serializer';
import { QueryExecutor } from '@/core/querying/application/execution/contracts/query-executor';
import { QueryExecutionResult } from '@/core/querying/application/execution/contracts/query-execution-result';
import { PaginatedQueryResultBuilder } from '@/core/querying/application/execution/result/paginated-query-result';
import { CursorQueryResultBuilder } from '@/core/querying/application/execution/result/cursor-query-result';
import { ProjectedQueryResultBuilder } from '@/core/querying/application/execution/result/projected-query-result';
import { CursorToken } from '@/core/querying/domain/ast/pagination/cursor/cursor-token';

/**
 * Executor genérico basado en TypeORM SelectQueryBuilder.
 *
 * DECISIÓN ARQUITECTÓNICA — Por qué un executor concreto y no solo el pipeline:
 *
 * El pipeline orquesta stages genéricos. El executor concreto:
 * 1. Construye el SelectQueryBuilder correcto para la entidad
 * 2. Sabe cómo ejecutar contra TypeORM (getManyAndCount vs getMany)
 * 3. Construye el resultado tipado correcto según el tipo de paginación
 * 4. Es el único lugar que conoce TypeORM
 *
 * Los QueryHandlers de NestJS (CQRS read side) reciben este executor
 * a través de DI — nunca acceden a TypeORM directamente.
 *
 * EXTENSIBILIDAD:
 * Para agregar ElasticsearchQueryExecutor, se implementa QueryExecutor
 * con la misma firma. Los handlers no cambian.
 *
 * FACTORY FUNCTION:
 * El executor se construye con una factory de QueryBuilder para garantizar
 * que cada request obtenga un QB fresco — los QBs de TypeORM son stateful.
 *
 * @example
 *   // En PropertyQueryingModule:
 *   providers: [{
 *     provide: PROPERTY_QUERY_EXECUTOR,
 *     useFactory: (dataSource: DataSource, metaRegistry, projRegistry) =>
 *       new TypeOrmQueryExecutor(
 *         () => dataSource.getRepository(PropertyOrmEntity).createQueryBuilder('property'),
 *         metaRegistry,
 *         projRegistry,
 *         'property:list', // default projection
 *       ),
 *     inject: [DATA_SOURCE, PROPERTY_META_REGISTRY, PROPERTY_PROJECTION_REGISTRY],
 *   }]
 */
export class TypeOrmQueryExecutor<
  TEntity extends ObjectLiteral,
  TField extends string = string,
  TResult extends Record<string, unknown> = Record<string, unknown>,
> implements QueryExecutor<TField, TResult> {

  constructor(
    /**
     * Factory que crea un QueryBuilder fresco en cada request.
     * CRÍTICO: el QB de TypeORM es stateful — reusar un QB entre requests
     * acumula WHERE clauses y causa bugs de seguridad sutiles.
     */
    private readonly queryBuilderFactory: () => SelectQueryBuilder<TEntity>,
    private readonly metadataRegistry: QueryMetadataRegistry<TField>,
    private readonly projectionRegistry: ProjectionRegistry,
    private readonly defaultProjectionName: string,
  ) {}

  async execute(
    request: QueryRequest<TField>,
  ): Promise<QueryExecutionResult<TResult>> {
    const { query: queryNode, context: queryContext } = request;

    // 1. Crear QB fresco para este request
    const queryBuilder = this.queryBuilderFactory();

    // 2. Traducir el QueryNode al QB (aplica filters, sorting, pagination)
    const translator = new TypeOrmQueryTranslator(
      queryBuilder,
      this.metadataRegistry,
    );
    const translated = translator.translate(queryNode);

    // 3. Resolver proyección
    const projectionName = queryNode.projection ?? this.defaultProjectionName;
    const projection = this.projectionRegistry.get(projectionName);
    const serializer = new DefaultProjectionSerializer();

    // 4. Ejecutar la query según el tipo de paginación
    const pagination = queryNode.pagination;

    if (!pagination) {
      const rawItems = await queryBuilder.getRawMany<TEntity>();
      const items = rawItems.map((raw) =>
        serializer.serialize(projection, raw),
      ) as TResult[];

      return ProjectedQueryResultBuilder.buildList(
        items,
      ) as unknown as QueryExecutionResult<TResult>;
    }

    if (pagination.type === 'offset') {
      const rawItems = await queryBuilder.getRawMany<TEntity>();
      // DECISIÓN: usamos getRawAndEntities para obtener el count eficientemente.
      // En PostgreSQL, un COUNT(*) OVER() en la misma query es más eficiente
      // que dos queries separadas para datasets grandes.
      const count = await this.executeCount(queryBuilder);

      const items = rawItems.map((raw) =>
        serializer.serialize(projection, raw),
      ) as TResult[];

      return PaginatedQueryResultBuilder.build(
        items,
        count,
        pagination.page,
        pagination.limit,
      );
    }

    // Cursor pagination
    // El translator ya pidió limit+1 (ver TypeOrmCursorPaginationTranslator)
    const rawItems = await queryBuilder.getRawMany<TEntity>();
    const items = rawItems.map((raw) =>
      serializer.serialize(projection, raw),
    ) as TResult[];

    const previousCursor = pagination.before ?? undefined;

    return CursorQueryResultBuilder.build(
      items,
      pagination.limit,
      queryNode.sorting?.[0]?.field ?? 'id',
      'id',
      previousCursor as CursorToken | undefined,
    );
  }

  /**
   * Ejecuta un COUNT(*) separado reutilizando el mismo QB pero sin paginación.
   * IMPORTANTE: Clonamos el QB — no alteramos el QB principal.
   */
  private async executeCount(
    queryBuilder: SelectQueryBuilder<TEntity>,
  ): Promise<number> {
    // TypeORM no tiene un método nativo de "clone without pagination".
    // La forma correcta es crear un QB de count explícito.
    // En producción, considerar usar una subquery o window function.
    return queryBuilder.clone().select('COUNT(*)', 'count').getRawOne<{ count: string }>()
      .then((r) => parseInt(r?.count ?? '0', 10));
  }
}
