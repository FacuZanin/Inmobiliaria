// backend/src/core/application/query/query.base.ts
import { randomUUID } from 'crypto';

export interface QueryMetadata {
  readonly userId?: string;
  readonly tenantId?: string;
  readonly correlationId?: string;
}

export abstract class Query {
  readonly queryId: string;
  readonly metadata: QueryMetadata;
  readonly issuedAt: Date;

  constructor(metadata: QueryMetadata = {}) {
    this.queryId = randomUUID();
    this.metadata = metadata;
    this.issuedAt = new Date();
  }
}
