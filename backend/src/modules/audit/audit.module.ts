// backend\src\modules\audit\audit.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuditLog } from './domain/entities/audit-log.entity';
import { AuditService } from './application/audit.service';
import { AuditRepository } from './infrastructure/repositories/audit.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AuditLog])],
  providers: [AuditService, AuditRepository],
  exports: [AuditService],
})
export class AuditModule {}
