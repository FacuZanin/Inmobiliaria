import { FilterNode } from '../ast/filter/filter-node';

export interface FilterableQuery<
  TField extends string = string,
> {
  readonly filters?: FilterNode<TField>;
}