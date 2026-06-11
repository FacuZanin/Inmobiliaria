export class InvalidPaginationException extends Error {
  constructor(
    message: string,
  ) {
    super(message);
  }
}