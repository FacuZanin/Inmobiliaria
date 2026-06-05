// backend\src\modules\documents\domain\specifications\document-reviewable.specification.ts
import { DocumentStatus } from '../enums/document-status.enum';

export class DocumentReviewableSpecification {
  static isSatisfiedBy(status: DocumentStatus): boolean {
    return [DocumentStatus.PENDING, DocumentStatus.UNDER_REVIEW].includes(
      status,
    );
  }
}
