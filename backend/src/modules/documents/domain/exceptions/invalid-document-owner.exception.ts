export class InvalidDocumentOwnerException extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvalidDocumentOwnerException.name;
  }
}
