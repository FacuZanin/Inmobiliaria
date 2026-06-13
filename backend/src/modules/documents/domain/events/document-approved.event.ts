// backend\src\modules\documents\domain\events\document-approved.event.ts
import { DomainEvent } from '@/core/domain/events/domain-event.base';

interface DocumentApprovedPayload {
  approvedBy: number;
}

export class DocumentApprovedEvent
  implements DomainEvent<DocumentApprovedPayload>
{
  readonly name =
    'documents.document.approved';

  readonly occurredAt = new Date();

  readonly aggregateId: string;

  readonly payload: DocumentApprovedPayload;

  constructor(
    documentId: number | null,
    approvedBy: number,
  ) {
    this.aggregateId = String(documentId);

    this.payload = {
      approvedBy,
    };
  }
}