// backend\src\modules\documents\domain\entities\document-verification.entity.ts
import { DocumentStatus } from '../enums/document-status.enum';

import { InvalidDocumentStatusException } from '../exceptions/invalid-document-status.exception';

export class DocumentVerificationEntity {
  constructor(
    public readonly status: DocumentStatus,

    public readonly reviewedBy?: number | null,

    public readonly reviewedAt?: Date | null,

    public readonly rejectionReason?: string | null,
  ) {
    if (!Object.values(DocumentStatus).includes(status)) {
      throw new InvalidDocumentStatusException(
        `Unsupported document status: ${status}`,
      );
    }

    if (status === DocumentStatus.REJECTED && !rejectionReason?.trim()) {
      throw new InvalidDocumentStatusException(
        'Rejected documents require a rejection reason.',
      );
    }

    if (status === DocumentStatus.APPROVED && rejectionReason) {
      throw new InvalidDocumentStatusException(
        'Approved documents cannot keep a rejection reason.',
      );
    }
  }

  approve(adminId: number): DocumentVerificationEntity {
    return new DocumentVerificationEntity(
      DocumentStatus.APPROVED,
      adminId,
      new Date(),
      null,
    );
  }

  reject(adminId: number, reason: string): DocumentVerificationEntity {
    const normalizedReason = reason.trim();

    if (!normalizedReason) {
      throw new InvalidDocumentStatusException(
        'Rejected documents require a rejection reason.',
      );
    }

    return new DocumentVerificationEntity(
      DocumentStatus.REJECTED,
      adminId,
      new Date(),
      normalizedReason,
    );
  }

  markUnderReview(): DocumentVerificationEntity {
    return new DocumentVerificationEntity(
      DocumentStatus.UNDER_REVIEW,
      this.reviewedBy,
      this.reviewedAt,
      this.rejectionReason,
    );
  }
}
