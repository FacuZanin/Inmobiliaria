// backend\src\modules\documents\domain\entities\document-owner.entity.ts
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

import { InvalidDocumentOwnerException } from '../exceptions/invalid-document-owner.exception';

export class DocumentOwnerEntity {
  constructor(
    public readonly ownerId: number,
    public readonly ownerType: DocumentOwnerType,
  ) {
    if (!Number.isInteger(ownerId) || ownerId <= 0) {
      throw new InvalidDocumentOwnerException(
        'Document owner id must be a positive integer.',
      );
    }

    if (!Object.values(DocumentOwnerType).includes(ownerType)) {
      throw new InvalidDocumentOwnerException(
        `Unsupported document owner type: ${ownerType}`,
      );
    }
  }

  equals(other: DocumentOwnerEntity): boolean {
    return this.ownerId === other.ownerId && this.ownerType === other.ownerType;
  }
}
