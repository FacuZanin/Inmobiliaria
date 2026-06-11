// backend/src/core/shared-kernel/errors/unauthorized.error.ts
import { BaseError } from './base.error';
export class UnauthorizedError extends BaseError {
  readonly code = 'UNAUTHORIZED' as const;
}
