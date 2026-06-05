// backend\src\modules\documents\domain\events\document-approved.event.ts
export class DocumentApprovedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: number | null,
    public readonly approvedBy: number,
  ) {}
}
