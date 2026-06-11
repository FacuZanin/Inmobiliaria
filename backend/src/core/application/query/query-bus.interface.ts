// backend/src/core/application/query/query-bus.interface.ts
import type { Query } from './query.base';

export interface IQueryBus {
  execute<TQuery extends Query, TResult>(query: TQuery): Promise<TResult>;
}
