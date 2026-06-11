import { FilterConditionNode } from '@/querying/domain/ast/filter/filter-condition-node';

import { FilterGroupNode } from '@/querying/domain/ast/filter/filter-group-node';

import { FilterNode } from '@/querying/domain/ast/filter/filter-node';

import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';

import { InvalidFilterFieldException } from '../exceptions/invalid-filter-field.exception';

import { InvalidFilterOperatorException } from '../exceptions/invalid-filter-operator.exception';

export class FilterNodeValidator<
  TField extends string = string,
> {
  constructor(
    private readonly registry: QueryMetadataRegistry<TField>,
  ) {}

  validate(
    node: FilterNode<TField>,
  ): void {
    if (node.type === 'condition') {
      this.validateCondition(node);

      return;
    }

    this.validateGroup(node);
  }

  private validateGroup(
    group: FilterGroupNode<TField>,
  ): void {
    for (const child of group.children) {
      this.validate(child);
    }
  }

  private validateCondition(
    condition: FilterConditionNode<TField>,
  ): void {
    const field =
      this.registry.getField(
        condition.field,
      );

    if (!field) {
      throw new InvalidFilterFieldException(
        condition.field,
      );
    }

    if (!field.filterable) {
      throw new InvalidFilterFieldException(
        condition.field,
      );
    }

    if (
      !field.allowedOperators?.includes(
        condition.operator,
      )
    ) {
      throw new InvalidFilterOperatorException(
        condition.field,
        condition.operator,
      );
    }
  }
}