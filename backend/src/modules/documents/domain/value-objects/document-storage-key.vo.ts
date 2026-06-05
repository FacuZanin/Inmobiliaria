import { InvalidDocumentFileException } from '../exceptions/invalid-document-file.exception';

export class DocumentStorageKey {
  private constructor(public readonly value: string) {}

  static create(value: string): DocumentStorageKey {
    const normalized = value.trim();

    if (!normalized) {
      throw new InvalidDocumentFileException(
        'Document storage key cannot be empty.',
      );
    }

    return new DocumentStorageKey(normalized);
  }
}
