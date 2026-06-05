// backend\src\modules\documents\domain\events\document-rejected.event.ts
export class DocumentRejectedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: number | null,
    public readonly rejectedBy: number,
    public readonly reason: string,
  ) {}
}
