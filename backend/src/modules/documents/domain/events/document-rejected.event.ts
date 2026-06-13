// backend\src\modules\documents\domain\events\document-rejected.event.ts
import { DomainEvent } from '@/core/domain/events/domain-event.base';

interface DocumentRejectedPayload {
  rejectedBy: number;
  reason: string;
}

export class DocumentRejectedEvent
  implements DomainEvent<DocumentRejectedPayload>
{
  readonly name =
    'documents.document.rejected';

  readonly occurredAt = new Date();

  readonly aggregateId: string;

  readonly payload: DocumentRejectedPayload;

  constructor(
    documentId: number | null,
    rejectedBy: number,
    reason: string,
  ) {
    this.aggregateId = String(documentId);

    this.payload = {
      rejectedBy,
      reason,
    };
  }
}