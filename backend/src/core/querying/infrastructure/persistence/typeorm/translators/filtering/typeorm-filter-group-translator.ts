// backend\src\core\querying\translation\typeorm\filtering\typeorm-filter-group-translator.ts
import { Brackets, SelectQueryBuilder } from 'typeorm';

import { FilterGroupNode } from '@/querying/domain/ast/filter/filter-group-node';

import { FILTER_GROUP_OPERATORS } from '@/querying/domain/ast/filter/filter-group-operator';

import { FilterNode } from '@/querying/domain/ast/filter/filter-node';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { TypeOrmJoinManager } from '../joins/typeorm-join-manager';

export class TypeOrmFilterGroupTranslator<
  TEntity,
  TField extends string = string,
> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,

    private readonly registry: QueryMetadataRegistry<TField>,

    private readonly joins: TypeOrmJoinManager<TEntity>,

    private readonly parameterFactory: () => string,

    private readonly translateChild: (node: FilterNode<TField>) => void,
  ) {}

  translate(group: FilterGroupNode<TField>): void {
    const method =
      group.operator === FILTER_GROUP_OPERATORS.AND ? 'andWhere' : 'orWhere';

    this.queryBuilder[method](
      new Brackets(() => {
        for (const child of group.children) {
          this.translateChild(child);
        }
      }),
    );
  }
}
