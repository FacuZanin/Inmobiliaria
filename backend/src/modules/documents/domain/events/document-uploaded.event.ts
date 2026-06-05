// backend\src\modules\documents\domain\events\document-uploaded.event.ts
import { DomainEvent } from '@/core/domain/events/domain-event';

import { DocumentType } from '../enums/document-type.enum';

interface DocumentUploadedPayload {
  ownerId: number;
  documentType: DocumentType;
}

export class DocumentUploadedEvent
  implements DomainEvent<DocumentUploadedPayload>
{
  readonly name =
    'documents.document.uploaded';

  readonly occurredAt = new Date();

  readonly aggregateId: string;

  readonly payload: DocumentUploadedPayload;

  constructor(
    ownerId: number,
    documentType: DocumentType,
  ) {
    this.aggregateId = String(ownerId);

    this.payload = {
      ownerId,
      documentType,
    };
  }
}