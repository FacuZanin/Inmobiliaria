import { FilterGroupOperator } from './filter-group-operator';

import { FilterNode } from './filter-node';

export interface FilterGroupNode<
  TField extends string = string,
> {
  readonly type: 'group';

  readonly operator: FilterGroupOperator;

  readonly children: readonly FilterNode<TField>[];
}