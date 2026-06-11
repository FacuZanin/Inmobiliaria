// backend/src/core/querying/domain/contracts/query-request.ts
import { QueryContext } from '../ast/query/query-context';
import { QueryNode } from '../ast/query/query-node';

export interface QueryRequest<
  TField extends string = string,
> {
  readonly query: QueryNode<TField>;

  readonly context?: QueryContext;
}