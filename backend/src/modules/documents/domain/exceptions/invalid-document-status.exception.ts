// backend\src\modules\documents\domain\exceptions\invalid-document-status.exception.ts
export class InvalidDocumentStatusException extends Error {
  constructor(message: string) {
    super(message);
    this.name = InvalidDocumentStatusException.name;
  }
}
