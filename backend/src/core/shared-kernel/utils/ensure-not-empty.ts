// backend/src/core/shared-kernel/utils/ensure-not-empty.ts
import { ValidationError } from '../errors/validation.error';

export function ensureNotEmpty(
  value: unknown,
  field = 'value',
): void {
  if (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '')
  ) {
    throw new ValidationError(
      `${field} no puede estar vacío`,
    );
  }
}