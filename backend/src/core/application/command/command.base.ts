// backend/src/core/application/command/command.base.ts
import { randomUUID } from 'crypto';

export interface CommandMetadata {
  readonly userId?: string;
  readonly tenantId?: string;
  readonly correlationId?: string;
  readonly ip?: string;
  readonly userAgent?: string;
}

export abstract class Command {
  readonly commandId: string;
  readonly metadata: CommandMetadata;
  readonly issuedAt: Date;

  constructor(metadata: CommandMetadata = {}) {
    this.commandId = randomUUID();
    this.metadata = metadata;
    this.issuedAt = new Date();
  }
}
