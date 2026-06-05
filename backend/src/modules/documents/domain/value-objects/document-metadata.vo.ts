export type DocumentMetadataValue = string | number | boolean | null;

export class DocumentMetadata {
  private constructor(
    public readonly values: Readonly<Record<string, DocumentMetadataValue>>,
  ) {}

  static empty(): DocumentMetadata {
    return new DocumentMetadata({});
  }

  static create(
    values: Record<string, DocumentMetadataValue>,
  ): DocumentMetadata {
    return new DocumentMetadata(Object.freeze({ ...values }));
  }
}
