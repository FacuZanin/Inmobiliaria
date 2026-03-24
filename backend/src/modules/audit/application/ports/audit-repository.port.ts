// backend\src\modules\audit\application\ports\audit-repository.port.ts
import { AuditLog } from '../../domain/entities/audit-log.entity';

export interface AuditRepositoryPort {
  create(data: Partial<AuditLog>): Promise<void>;
}
