// backend\src\common\decorators\audit.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const AUDIT_KEY = 'audit';

export interface AuditMetadata {
  action: string;
  entity: string;
  entityIdParam?: string;
}

export const Audit = (data: AuditMetadata) =>
  SetMetadata(AUDIT_KEY, data);