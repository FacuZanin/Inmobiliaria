// backend/src/core/shared-kernel/result/result.ts
import type { BaseError } from '../errors/base.error';

export type Result<T, E extends BaseError = BaseError> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };

export const Result = {
  ok: <T>(value: T): Result<T, never> => ({ ok: true, value }),
  fail: <E extends BaseError>(error: E): Result<never, E> => ({
    ok: false,
    error,
  }),
};
