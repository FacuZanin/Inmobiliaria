// backend/src/core/shared-kernel/utils/guard.util.ts
import { Result } from '../result/result';
import { ValidationError } from '../errors/validation.error';

export class Guard {
  static againstNullOrUndefined(value: unknown, field: string): Result<void> {
    if (value === null || value === undefined) {
      return Result.fail(
        new ValidationError(`${field} no puede ser nulo o indefinido`),
      );
    }
    return Result.ok(undefined);
  }

  static againstEmptyString(value: string, field: string): Result<void> {
    if (value.trim().length === 0) {
      return Result.fail(new ValidationError(`${field} no puede estar vacío`));
    }
    return Result.ok(undefined);
  }

  static againstNegativeNumber(value: number, field: string): Result<void> {
    if (value < 0) {
      return Result.fail(new ValidationError(`${field} no puede ser negativo`));
    }
    return Result.ok(undefined);
  }

  static againstOutOfRange(
    value: number,
    min: number,
    max: number,
    field: string,
  ): Result<void> {
    if (value < min || value > max) {
      return Result.fail(
        new ValidationError(
          `${field} debe estar entre ${min} y ${max}, recibido: ${value}`,
        ),
      );
    }
    return Result.ok(undefined);
  }
}
