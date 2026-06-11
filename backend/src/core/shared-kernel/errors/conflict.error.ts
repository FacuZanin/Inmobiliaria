// backend/src/core/shared-kernel/errors/conflict.error.ts
import { BaseError } from './base.error';
export class ConflictError extends BaseError {
  readonly code = 'CONFLICT' as const;
}
