// backend/src/core/querying/domain/contracts/cursor-response.ts
import { CursorToken } from '../ast/pagination/cursor/cursor-token';

export interface CursorResponse<TResult> {
  readonly data: readonly TResult[];

  readonly nextCursor?: CursorToken;

  readonly previousCursor?: CursorToken;

  readonly hasNextPage: boolean;

  readonly hasPreviousPage: boolean;
}