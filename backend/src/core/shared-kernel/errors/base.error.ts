// backend/src/core/shared-kernel/errors/base.error.ts
export abstract class BaseError extends Error {
  abstract readonly code: string;

  constructor(
    message: string,
    readonly metadata?: Record<string, unknown>,
  ) {
    super(message);

    this.name = this.constructor.name;
  }
}
