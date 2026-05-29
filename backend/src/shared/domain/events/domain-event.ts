export interface DomainEvent<TPayload = unknown> {
  readonly name: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly payload: TPayload;
}
