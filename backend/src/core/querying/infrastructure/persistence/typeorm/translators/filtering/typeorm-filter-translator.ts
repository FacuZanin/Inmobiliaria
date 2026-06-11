// backend\src\core\querying\translation\typeorm\filtering\typeorm-filter-translator.ts
import { SelectQueryBuilder } from 'typeorm';

import { FilterNode } from '@/querying/domain/ast/filter/filter-node';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { TypeOrmJoinManager } from '../joins/typeorm-join-manager';

import { TypeOrmFilterConditionTranslator } from './typeorm-filter-condition-translator';

import { TypeOrmFilterGroupTranslator } from './typeorm-filter-group-translator';

export class TypeOrmFilterTranslator<
  TEntity,
  TField extends string = string,
> {
  private parameterIndex = 0;

  private readonly joins: TypeOrmJoinManager<TEntity>;

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,

    private readonly registry: QueryMetadataRegistry<TField>,
  ) {
    this.joins =
      new TypeOrmJoinManager(
        queryBuilder,
      );
  }

  translate(
    node: FilterNode<TField>,
  ): void {
    if (node.type === 'condition') {
      new TypeOrmFilterConditionTranslator(
        this.queryBuilder,
        this.registry,
        this.joins,
        () =>
          this.createParameter(),
      ).translate(node);

      return;
    }

    new TypeOrmFilterGroupTranslator(
      this.queryBuilder,
      this.registry,
      this.joins,
      () =>
        this.createParameter(),
      this.translate.bind(this),
    ).translate(node);
  }

  private createParameter(): string {
    return `p_${this.parameterIndex++}`;
  }
}