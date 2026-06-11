// backend/src/core/querying/domain/ast/filter/filter-node.ts
import { FilterConditionNode } from './filter-condition-node';

import { FilterGroupNode } from './filter-group-node';

export type FilterNode<
  TField extends string = string,
> =
  | FilterConditionNode<TField>
  | FilterGroupNode<TField>;