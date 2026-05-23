// backend\src\modules\audit\application\audit.service.ts
import { Injectable } from '@nestjs/common';

import { AuditRepository } from '../infrastructure/repositories/audit.repository';
import { CreateAuditDto } from '@modules/audit/domain/dto/create-audit.dto';

@Injectable()
export class AuditService {
  constructor(
    private readonly auditRepository: AuditRepository,
  ) {}

  async log(dto: CreateAuditDto) {
    return this.auditRepository.create(dto);
  }

  async create(dto: CreateAuditDto) {
    return this.log(dto);
  }

  async findAll() {
    return this.auditRepository.findAll();
  }
}