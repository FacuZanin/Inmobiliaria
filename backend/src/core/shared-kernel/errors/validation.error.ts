// backend/src/core/shared-kernel/errors/validation.error.ts
import { BaseError } from './base.error';
export class ValidationError extends BaseError {
  readonly code = 'VALIDATION_ERROR' as const;
}
