import { FilterGroupOperator } from '../../domain/ast/filter/filter-group-operator';
import type { FilterConditionNode } from '../../domain/ast/filter/filter-condition-node';
import type { FilterGroupNode } from '../../domain/ast/filter/filter-group-node';
import type { FilterNode } from '../../domain/ast/filter/filter-node';

export class FilterGroup<TField extends string = string>
  implements FilterGroupNode<TField>
{
  readonly type = 'group';
  readonly operator: FilterGroupOperator;
  readonly children: readonly FilterNode<TField>[];

  constructor(
    filters: readonly FilterConditionNode<TField>[] = [],
    operator: FilterGroupOperator = 'and',
  ) {
    this.operator = operator;
    this.children = filters;
  }

  get filters(): readonly FilterConditionNode<TField>[] {
    return this.children.filter(
      (child): child is FilterConditionNode<TField> =>
        child.type === 'condition',
    );
  }

  isEmpty(): boolean {
    return this.children.length === 0;
  }
}
