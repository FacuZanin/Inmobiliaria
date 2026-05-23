// backend\src\modules\audit\infrastructure\controllers\audit.controller.ts
import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { AuditService } from '../../application/audit.service';
import { CreateAuditDto } from '@modules/audit/domain/dto/create-audit.dto';

@ApiTags('Audit')
@Controller('audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Post()
  async create(@Body() dto: CreateAuditDto) {
    return this.auditService.create(dto);
  }

  @Get()
  async findAll() {
    return this.auditService.findAll();
  }
}