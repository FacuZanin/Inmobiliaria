import { FilterNode } from '../filter/filter-node';

import { PaginationNode } from '../pagination/pagination-node';

import { SortingNode } from '../sorting/sorting-node';

export interface QueryNode<
  TField extends string = string,
> {
  readonly filters?: FilterNode<TField>;

  readonly sorting?: SortingNode<TField>;

  readonly pagination?: PaginationNode;

  readonly projection?: string;
}