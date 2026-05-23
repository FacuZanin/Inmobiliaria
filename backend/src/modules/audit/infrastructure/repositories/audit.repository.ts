// backend\src\modules\audit\infrastructure\repositories\audit.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { AuditLog } from '../../domain/entities/audit-log.entity';

@Injectable()
export class AuditRepository {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repo: Repository<AuditLog>,
  ) {}

  async create(data: Partial<AuditLog>) {
    const audit = this.repo.create(data);

    return this.repo.save(audit);
  }

  async findAll() {
    return this.repo.find({
      order: {
        createdAt: 'DESC',
      },
      take: 100,
    });
  }
}