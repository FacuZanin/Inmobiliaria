// backend\src\modules\documents\domain\events\document-status-changed.event.ts
import { DomainEvent } from '@/core/domain/events/domain-event';

import { DocumentStatus } from '../enums/document-status.enum';

interface DocumentStatusChangedPayload {
  newStatus: DocumentStatus;
}

export class DocumentStatusChangedEvent
  implements DomainEvent<DocumentStatusChangedPayload>
{
  readonly name =
    'documents.document.status-changed';

  readonly occurredAt = new Date();

  readonly aggregateId: string;

  readonly payload: DocumentStatusChangedPayload;

  constructor(
    documentId: number | null,
    newStatus: DocumentStatus,
  ) {
    this.aggregateId = String(documentId);

    this.payload = {
      newStatus,
    };
  }
}