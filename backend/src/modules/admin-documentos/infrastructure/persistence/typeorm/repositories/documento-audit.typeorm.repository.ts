// backend\src\modules\admin-documentos\infrastructure\persistence\typeorm\repositories\documento-audit.typeorm.repository.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type { DocumentoAuditRepositoryPort } from '../../../../application/ports/documento-audit-repository.port';
import {
  DocumentoAudit,
} from '../../../../domain/entities/documento-audit.entity';

import { DocumentoTipo } from '@shared/enums/documento-tipo.enum';

@Injectable()
export class DocumentoAuditTypeOrmRepository
  implements DocumentoAuditRepositoryPort
{
  constructor(
    @InjectRepository(DocumentoAudit)
    private readonly repo: Repository<DocumentoAudit>,
  ) {}

  async save(audit: Partial<DocumentoAudit>): Promise<void> {
    await this.repo.save(audit);
  }

  async findByDocumento(
    documentoId: number,
    tipo: DocumentoTipo,
  ): Promise<DocumentoAudit[]> {
    return this.repo.find({
      where: {
        documentoId,
        documentoTipo: tipo,
      },
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
