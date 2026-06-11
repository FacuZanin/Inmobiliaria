export class InvalidFilterValueException extends Error {
  constructor(
    field: string,
  ) {
    super(
      `Invalid filter value for field "${field}"`,
    );
  }
}