import { FilterOperator } from './filter-operator';

import { FilterValue } from './filter-value';

export interface FilterConditionNode<
  TField extends string = string,
> {
  readonly type: 'condition';

  readonly field: TField;

  readonly operator: FilterOperator;

  readonly value?: FilterValue;
}