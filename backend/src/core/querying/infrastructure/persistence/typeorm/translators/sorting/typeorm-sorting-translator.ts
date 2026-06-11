// backend\src\core\querying\translation\typeorm\sorting\typeorm-sorting-translator.ts
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { SortingNode } from '@/core/querying/domain/ast/sorting/sorting-node';
import { SortNode } from '@/core/querying/domain/ast/sorting/sort-node';

import { SORT_DIRECTIONS } from '@/core/querying/domain/ast/sorting/sort-direction';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { TypeOrmJoinManager } from '../../joins/typeorm-join-manager';

export class TypeOrmSortingTranslator<
  TEntity extends ObjectLiteral,
  TField extends string = string,
> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,

    private readonly registry: QueryMetadataRegistry<TField>,

    private readonly joins: TypeOrmJoinManager<TEntity>,

    private readonly stableSortField?: TField,
  ) {}

  translate(sorting: SortingNode<TField>): void {
    const appliedFields = new Set<string>();

    for (const node of sorting) {
      this.translateNode(node);

      appliedFields.add(node.field);
    }

    this.applyStableSorting(appliedFields, sorting);
  }

  private translateNode(node: SortNode<TField>): void {
    const metadata = this.registry.getField(node.field);

    if (!metadata) {
      return;
    }

    if (metadata.relation) {
      this.joins.ensureJoin(metadata.relation);
    }

    const direction = node.direction === SORT_DIRECTIONS.ASC ? 'ASC' : 'DESC';

    this.queryBuilder.addOrderBy(metadata.databasePath, direction);
  }

  private applyStableSorting(
    appliedFields: Set<string>,

    sorting: SortingNode<TField>,
  ): void {
    if (!this.stableSortField) {
      return;
    }

    if (appliedFields.has(this.stableSortField)) {
      return;
    }

    const metadata = this.registry.getField(this.stableSortField);

    if (!metadata) {
      return;
    }

    const primaryDirection =
      sorting[0]?.direction === SORT_DIRECTIONS.ASC ? 'ASC' : 'DESC';

    this.queryBuilder.addOrderBy(metadata.databasePath, primaryDirection);
  }
}
