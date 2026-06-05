export class DocumentId {
  private constructor(public readonly value: number) {}

  static create(value: number): DocumentId {
    if (!Number.isInteger(value) || value <= 0) {
      throw new Error('Document id must be a positive integer.');
    }

    return new DocumentId(value);
  }
}
