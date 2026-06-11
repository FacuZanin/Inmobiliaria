// backend\src\core\querying\infrastructure\persistence\typeorm\translators\typeorm-query-translator.ts
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { QueryNode } from '@/core/querying/domain/ast/query/query-node';

import { CursorPaginationNode } from '@/core/querying/domain/ast/pagination/cursor/cursor-pagination-node';

import { OffsetPaginationNode } from '@/core/querying/domain/ast/pagination/offset/offset-pagination-node';

import { SortingNode } from '@/core/querying/domain/ast/sorting/sorting-node';

import { FilterNode } from '@/core/querying/domain/ast/filter/filter-node';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { QueryTranslator } from '../contracts/query-translator';

import { TranslatedQueryResult } from '@/core/querying/application/execution/result/translated-query-result';

import { TypeOrmFilterTranslator } from './filtering/typeorm-filter-translator';

import { TypeOrmSortingTranslator } from './sorting/typeorm-sorting-translator';

import { TypeOrmOffsetPaginationTranslator } from './pagination/typeorm-offset-pagination-translator';

import { TypeOrmCursorPaginationTranslator } from './pagination/typeorm-cursor-pagination-translator';

import { TypeOrmJoinManager } from '../joins/typeorm-join-manager';

export class TypeOrmQueryTranslator<
  TEntity extends ObjectLiteral,
  TField extends string = string,
> implements QueryTranslator<QueryNode<TField>, SelectQueryBuilder<TEntity>> {
  private readonly joins: TypeOrmJoinManager<TEntity>;

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,

    private readonly registry: QueryMetadataRegistry<TField>,
  ) {
    this.joins = new TypeOrmJoinManager(this.queryBuilder);
  }

  translate(
    query: Readonly<QueryNode<TField>>,
  ): TranslatedQueryResult<SelectQueryBuilder<TEntity>> {
    this.applyFiltering(query.filters);

    this.applySorting(query.sorting);

    this.applyPagination(query.pagination, query.sorting);

    return {
      query: this.queryBuilder,

      metadata: {
        requiresPagination: !!query.pagination,

        requiresSorting: !!query.sorting?.length,

        requiresProjection: !!query.projection,
      },
    };
  }

  private applyFiltering(filters?: FilterNode<TField>): void {
    if (!filters) {
      return;
    }

    new TypeOrmFilterTranslator(this.queryBuilder, this.registry).translate(
      filters,
    );
  }

  private applySorting(sorting?: SortingNode<TField>): void {
    if (!sorting?.length) {
      return;
    }

    new TypeOrmSortingTranslator(
      this.queryBuilder,
      this.registry,
      this.joins,
    ).translate(sorting);
  }

  private applyPagination(
    pagination?: OffsetPaginationNode | CursorPaginationNode,
    sorting?: SortingNode<TField>,
  ): void {
    if (!pagination) {
      return;
    }

    if (pagination.type === 'offset') {
      new TypeOrmOffsetPaginationTranslator(this.queryBuilder).translate(
        pagination,
      );

      return;
    }

    new TypeOrmCursorPaginationTranslator(
      this.queryBuilder,
      this.registry,
      this.joins,
    ).translate(
      pagination,
      sorting,
    );
  }
}
