// backend/src/core/shared-kernel/errors/not-found.error.ts
import { BaseError } from './base.error';
export class NotFoundError extends BaseError {
  readonly code = 'NOT_FOUND' as const;
}
