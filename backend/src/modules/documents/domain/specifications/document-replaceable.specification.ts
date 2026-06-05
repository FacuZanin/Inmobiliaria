// backend\src\modules\documents\domain\specifications\document-replaceable.specification.ts
import { DocumentStatus } from '../enums/document-status.enum';

export class DocumentReplaceableSpecification {
  static isSatisfiedBy(status: DocumentStatus): boolean {
    return [
      DocumentStatus.REJECTED,
      DocumentStatus.PENDING,
      DocumentStatus.UNDER_REVIEW,
    ].includes(status);
  }
}
