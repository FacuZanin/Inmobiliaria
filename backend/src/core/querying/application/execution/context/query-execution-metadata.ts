export interface QueryExecutionMetadata {
  readonly requestId: string;
  readonly startedAt: Date;
  readonly completedAt: Date;
  readonly durationMs: number;
  readonly cacheHit: boolean;
}

export class QueryExecutionMetadataBuilder {
  private readonly startedAt = new Date();

  constructor(private readonly cacheHit = false) {}

  build(requestId: string): QueryExecutionMetadata {
    const completedAt = new Date();

    return {
      requestId,
      startedAt: this.startedAt,
      completedAt,
      durationMs: completedAt.getTime() - this.startedAt.getTime(),
      cacheHit: this.cacheHit,
    };
  }
}
