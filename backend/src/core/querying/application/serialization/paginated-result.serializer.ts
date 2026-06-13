// backend/src/core/querying/application/serialization/paginated-result.serializer.ts
import { PaginatedResponse } from '../../domain/contracts/paginated-response';

export class PaginatedResultSerializer {
  serialize<TResult>(
    payload: PaginatedResponse<TResult>,
  ): PaginatedResponse<TResult> {
    return payload;
  }
}
