export class InvalidDocumentFileException extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvalidDocumentFileException.name;
  }
}
