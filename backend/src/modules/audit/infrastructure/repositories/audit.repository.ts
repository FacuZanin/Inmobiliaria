// backend\src\modules\audit\infrastructure\repositories\audit.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from '../../domain/entities/audit-log.entity';
import { AuditRepositoryPort } from '../../application/ports/audit-repository.port';

@Injectable()
export class AuditRepository implements AuditRepositoryPort {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async create(data: Partial<AuditLog>): Promise<void> {
    await this.repo.save(this.repo.create(data));
  }
}
