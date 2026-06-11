// backend/src/core/application/query/query-handler.interface.ts
import type { Query } from './query.base';
import type { Result } from '../../shared-kernel/result/result';

export interface IQueryHandler<TQuery extends Query, TResult> {
  execute(query: TQuery): Promise<Result<TResult>>;
}
