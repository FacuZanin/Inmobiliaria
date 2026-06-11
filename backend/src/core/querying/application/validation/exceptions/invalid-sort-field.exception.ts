export class InvalidSortFieldException extends Error {
  constructor(
    field: string,
  ) {
    super(
      `Invalid sort field: ${field}`,
    );
  }
}