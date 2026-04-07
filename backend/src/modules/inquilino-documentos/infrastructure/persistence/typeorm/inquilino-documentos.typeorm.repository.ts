// backend\src\modules\inquilino-documentos\infrastructure\persistence\typeorm\inquilino-documentos.typeorm.repository.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import type {
  InquilinoDocumentosRepositoryPort,
} from '../../../application/ports/inquilino-documentos-repository.port';

import { TipoDocumentoInquilino } from '@shared/contracts/enums/tipo-documento-inquilino.enum';
import { Inquilino } from '../../../../inquilinos/domain/entities/inquilino.entity';
import { InquilinoDocumento } from '../../../domain/entities/inquilino-documento.entity';
import { DocumentoAudit as AdminDocumentoAudit } from '../../../../admin-documentos/domain/entities/documento-audit.entity';
import { DocumentoEstado } from '@shared/contracts/enums/documento-estado.enum';

@Injectable()
export class InquilinoDocumentosTypeOrmRepository
  implements InquilinoDocumentosRepositoryPort
{
  constructor(
    @InjectRepository(InquilinoDocumento)
    private readonly documentosRepo: Repository<InquilinoDocumento>,

    @InjectRepository(Inquilino)
    private readonly inquilinoRepo: Repository<Inquilino>,

    @InjectRepository(AdminDocumentoAudit)
    private readonly auditRepo: Repository<AdminDocumentoAudit>,
  ) {}

  // 🔍 Buscar el inquilino por el user.id
  async findInquilinoByUserId(userId: number) {
    return this.inquilinoRepo.findOne({
      where: { userId },
    });
  }

  async findDocumentoByInquilinoAndTipo(
    inquilinoId: number,
    tipo: TipoDocumentoInquilino,
  ) {
    return this.documentosRepo.findOne({
      where: {
        inquilino: { id: inquilinoId },
        tipoDocumento: tipo,
      },
    });
  }

  async findById(id: number) {
    return this.documentosRepo.findOne({ where: { id } });
  }

  async saveDocumento(doc: Partial<InquilinoDocumento>) {
    try {
      const entity = this.documentosRepo.create(doc as InquilinoDocumento);
      return this.documentosRepo.save(entity);
    } catch (err) {
      console.error(err);
      throw new BadRequestException('Error al guardar documento');
    }
  }

  async listByInquilino(inquilinoId: number) {
    return this.documentosRepo.find({
      where: { inquilino: { id: inquilinoId } },
    });
  }

  async findAprobadosByInquilino(inquilinoId: number) {
    return this.documentosRepo.find({
      where: {
        inquilino: { id: inquilinoId },
        estado: DocumentoEstado.APROBADO,
      },
    });
  }

  async saveAudit(audit: Partial<AdminDocumentoAudit>) {
    const a = this.auditRepo.create(audit as AdminDocumentoAudit);
    return this.auditRepo.save(a);
  }
}
