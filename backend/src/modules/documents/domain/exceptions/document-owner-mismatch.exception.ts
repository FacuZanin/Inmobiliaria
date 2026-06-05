// backend\src\modules\documents\domain\exceptions\document-owner-mismatch.exception.ts
export class DocumentOwnerMismatchException extends Error {
  constructor() {
    super('Document owner does not match.');
  }
}
