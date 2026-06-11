import { PaginatedResponse } from '../../contracts/paginated-response';

export class PaginatedResultSerializer {
  serialize<TResult>(
    payload: PaginatedResponse<TResult>,
  ): PaginatedResponse<TResult> {
    return payload;
  }
}