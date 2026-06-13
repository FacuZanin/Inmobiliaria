// backend\src\modules\documents\domain\events\document-replaced.event.ts
import { DomainEvent } from '@/core/domain/events/domain-event.base';

interface DocumentReplacedPayload {
  oldFileUrl: string;
  newFileUrl: string;
}

export class DocumentReplacedEvent implements DomainEvent<DocumentReplacedPayload> {
  readonly name = 'documents.document.replaced';

  readonly occurredAt = new Date();

  readonly aggregateId: string;

  readonly payload: DocumentReplacedPayload;

  constructor(
    documentId: number | null,
    oldFileUrl: string,
    newFileUrl: string,
  ) {
    this.aggregateId = String(documentId);

    this.payload = {
      oldFileUrl,
      newFileUrl,
    };
  }
}
