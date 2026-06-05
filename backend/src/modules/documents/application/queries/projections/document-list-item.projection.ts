// backend\src\modules\documents\application\queries\projections\document-list-item.projection.ts
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';
import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentType } from '@/modules/documents/domain/enums/document-type.enum';

export interface DocumentListItemProjection {
  id: number;

  type: DocumentType;

  status: DocumentStatus;

  ownerId: number;

  ownerType: DocumentOwnerType;

  fileUrl: string;

  reviewedBy: number | null;

  reviewedAt: Date | null;

  createdAt: Date;
}