import { FilterNode } from '@/core/querying/domain/ast/filter/filter-node';

export interface FilterTranslator<TResult> {
  translate(
    filter: FilterNode,
  ): TResult;
} 