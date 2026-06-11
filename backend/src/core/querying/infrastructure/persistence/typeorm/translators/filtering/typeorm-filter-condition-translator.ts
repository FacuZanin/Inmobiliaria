// backend\src\core\querying\translation\typeorm\filtering\typeorm-filter-condition-translator.ts
import { SelectQueryBuilder } from 'typeorm';

import { FilterConditionNode } from '@/querying/domain/ast/filter/filter-condition-node';

import { FILTER_OPERATORS } from '@/querying/domain/ast/filter/filter-operator';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { TypeOrmJoinManager } from '../joins/typeorm-join-manager';

export class TypeOrmFilterConditionTranslator<
  TEntity,
  TField extends string = string,
> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,

    private readonly registry: QueryMetadataRegistry<TField>,

    private readonly joins: TypeOrmJoinManager<TEntity>,

    private readonly parameterFactory: () => string,
  ) {}

  translate(condition: FilterConditionNode<TField>): void {
    const metadata = this.registry.getField(condition.field);

    if (!metadata) {
      return;
    }

    if (metadata.relation) {
      this.joins.ensureJoin(metadata.relation);
    }

    const path = metadata.databasePath;

    const parameter = this.parameterFactory();

    switch (condition.operator) {
      case FILTER_OPERATORS.EQ:
        this.queryBuilder.andWhere(`${path} = :${parameter}`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.NEQ:
        this.queryBuilder.andWhere(`${path} != :${parameter}`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.GT:
        this.queryBuilder.andWhere(`${path} > :${parameter}`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.GTE:
        this.queryBuilder.andWhere(`${path} >= :${parameter}`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.LT:
        this.queryBuilder.andWhere(`${path} < :${parameter}`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.LTE:
        this.queryBuilder.andWhere(`${path} <= :${parameter}`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.CONTAINS:
        this.queryBuilder.andWhere(`${path} ILIKE :${parameter}`, {
          [parameter]: `%${condition.value}%`,
        });

        return;

      case FILTER_OPERATORS.STARTS_WITH:
        this.queryBuilder.andWhere(`${path} ILIKE :${parameter}`, {
          [parameter]: `${condition.value}%`,
        });

        return;

      case FILTER_OPERATORS.ENDS_WITH:
        this.queryBuilder.andWhere(`${path} ILIKE :${parameter}`, {
          [parameter]: `%${condition.value}`,
        });

        return;

      case FILTER_OPERATORS.IN:
        this.queryBuilder.andWhere(`${path} IN (:...${parameter})`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.NOT_IN:
        this.queryBuilder.andWhere(`${path} NOT IN (:...${parameter})`, {
          [parameter]: condition.value,
        });

        return;

      case FILTER_OPERATORS.IS_NULL:
        this.queryBuilder.andWhere(`${path} IS NULL`);

        return;

      case FILTER_OPERATORS.IS_NOT_NULL:
        this.queryBuilder.andWhere(`${path} IS NOT NULL`);

        return;

      case FILTER_OPERATORS.BETWEEN: {
        const [start, end] = condition.value as readonly [unknown, unknown];

        this.queryBuilder.andWhere(
          `${path} BETWEEN :${parameter}_start AND :${parameter}_end`,
          {
            [`${parameter}_start`]: start,

            [`${parameter}_end`]: end,
          },
        );

        return;
      }
    }
  }
}
