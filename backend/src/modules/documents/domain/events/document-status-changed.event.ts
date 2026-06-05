// backend\src\modules\documents\domain\events\document-status-changed.event.ts
import { DocumentStatus } from '../enums/document-status.enum';

export class DocumentStatusChangedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: number | null,
    public readonly newStatus: DocumentStatus,
  ) {}
}
