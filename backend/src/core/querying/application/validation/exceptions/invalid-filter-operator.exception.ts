export class InvalidFilterOperatorException extends Error {
  constructor(
    field: string,

    operator: string,
  ) {
    super(
      `Invalid operator "${operator}" for field "${field}"`,
    );
  }
}