// backend\src\modules\documents\domain\exceptions\unsupported-document-type.exception.ts
import { DocumentType } from '../enums/document-type.enum';

export class UnsupportedDocumentTypeException extends Error {
  constructor(type: DocumentType) {
    super(`Unsupported document type: ${type}`);
    this.name = UnsupportedDocumentTypeException.name;
  }
}
