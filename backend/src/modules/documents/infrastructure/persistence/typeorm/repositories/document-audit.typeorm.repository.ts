// backend\src\modules\documents\infrastructure\persistence\typeorm\repositories\document-audit.typeorm.repository.ts
import { Injectable } from '@nestjs/common';

import { EntityManager } from 'typeorm';

import { DocumentAuditRepositoryPort } from '@/modules/documents/domain/repositories/document-audit.repository.port';

import { DocumentAuditEntity } from '@/modules/documents/domain/entities/document-audit.entity';

import { DocumentAuditOrmEntity } from '../entities/document-audit.orm-entity';

import { DocumentAuditMapper } from '@/modules/documents/infrastructure/mappers/document-audit.mapper';

@Injectable()
export class DocumentAuditTypeOrmRepository implements DocumentAuditRepositoryPort {
  constructor(private readonly manager: EntityManager) {}

  async save(audit: DocumentAuditEntity): Promise<DocumentAuditEntity> {
    const ormEntity = DocumentAuditMapper.toOrm(audit);

    const saved = await this.manager.save(DocumentAuditOrmEntity, ormEntity);

    return DocumentAuditMapper.toDomain(saved);
  }

  async findByDocumentId(documentId: number): Promise<DocumentAuditEntity[]> {
    const audits = await this.manager.find(DocumentAuditOrmEntity, {
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
