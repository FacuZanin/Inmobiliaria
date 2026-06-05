// backend\src\modules\documents\domain\events\document-uploaded.event.ts
import { DocumentType } from '../enums/document-type.enum';

export class DocumentUploadedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly ownerId: number,
    public readonly documentType: DocumentType,
  ) {}
}
