// backend/src/core/shared-kernel/errors/base.error.ts
export abstract class BaseError {
  abstract readonly code: string;
  constructor(
    readonly message: string,
    readonly metadata?: Record<string, unknown>,
  ) {}
}
