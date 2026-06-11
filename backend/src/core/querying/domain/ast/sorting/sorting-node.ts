// backend/src/core/querying/domain/ast/sorting/sorting-node.ts
import { SortNode } from './sort-node';

export type SortingNode<TField extends string = string> =
  readonly SortNode<TField>[];
