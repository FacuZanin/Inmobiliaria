export class InvalidFilterFieldException extends Error {
  constructor(
    field: string,
  ) {
    super(
      `Invalid filter field: ${field}`,
    );
  }
}