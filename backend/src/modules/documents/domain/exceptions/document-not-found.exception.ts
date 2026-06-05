// backend\src\modules\documents\domain\exceptions\document-not-found.exception.ts
export class DocumentNotFoundException extends Error {
  constructor(documentId: number) {
    super(`Document with id ${documentId} was not found.`);
    this.name = DocumentNotFoundException.name;
  }
}
