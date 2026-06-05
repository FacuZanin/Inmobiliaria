// backend\src\modules\documents\domain\exceptions\document-already-approved.exception.ts
export class DocumentAlreadyApprovedException extends Error {
  constructor() {
    super('Document is already approved.');
    this.name = DocumentAlreadyApprovedException.name;
  }
}
