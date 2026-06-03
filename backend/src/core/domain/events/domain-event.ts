// backend\src\core\domain\events\domain-event.ts
export interface DomainEvent<TPayload = unknown> {
  readonly name: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: TPayload;
}
