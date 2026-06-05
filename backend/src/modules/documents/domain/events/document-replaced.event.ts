// backend\src\modules\documents\domain\events\document-replaced.event.ts
export class DocumentReplacedEvent {
  readonly occurredAt = new Date();

  constructor(
    public readonly documentId: number | null,
    public readonly oldFileUrl: string,
    public readonly newFileUrl: string,
  ) {}
}
