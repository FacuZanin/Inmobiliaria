// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\document-audit.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { DocumentAuditRepositoryPort } from '@/modules/documents/domain/repositories/document-audit.repository.port';

import { DocumentAuditEntity } from '@/modules/documents/domain/entities/document-audit.entity';

import { DocumentAuditOrmEntity } from '../entities/document-audit.orm-entity';

import { DocumentAuditMapper } from '@/modules/documents/infrastructure/mappers/document-audit.mapper';

@Injectable()
export class DocumentAuditTypeOrmRepository implements DocumentAuditRepositoryPort {
  constructor(
    @InjectRepository(DocumentAuditOrmEntity)
    private readonly repository: Repository<DocumentAuditOrmEntity>,
  ) {}

  async save(audit: DocumentAuditEntity): Promise<DocumentAuditEntity> {
    const orm = DocumentAuditMapper.toOrm(audit);

    const saved = await this.repository.save(orm);

    return DocumentAuditMapper.toDomain(saved);
  }

  async findByDocumentId(documentId: number): Promise<DocumentAuditEntity[]> {
    const audits = await this.repository.find({
      where: {
        documentId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return audits.map(DocumentAuditMapper.toDomain);
  }
}
