import { SortingNode } from '@/core/querying/domain/ast/sorting/sorting-node';

export interface SortableQuery<TField extends string = string> {
  readonly sorting?: SortingNode<TField>;
}