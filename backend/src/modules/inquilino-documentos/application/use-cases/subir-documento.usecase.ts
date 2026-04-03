// backend\src\modules\inquilino-documentos\application\use-cases\subir-documento.usecase.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';

import { DocumentoEstado } from '@shared/enums/documento-estado.enum';
import { DocumentoAuditAction } from '@shared/enums/documento-audit-action.enum';

import type { User } from '../../../user/domain/entities/user.entity';
import type { InquilinoDocumentosRepositoryPort } from '../ports/inquilino-documentos-repository.port';
import type { CreateInquilinoDocumentoDto } from '../dto/create-inquilino-documento.dto';
import type { FileStoragePort } from '../../../uploads/application/ports/file-storage.port';

@Injectable()
export class SubirDocumentoInquilinoUseCase {
  constructor(
    private readonly repo: InquilinoDocumentosRepositoryPort,
    private readonly storage: FileStoragePort,
  ) {}

  async execute(
    dto: CreateInquilinoDocumentoDto,
    archivo: Express.Multer.File,
    user: User,
  ) {
    if (!archivo) throw new BadRequestException('Archivo requerido.');

    const inquilino = await this.repo.findInquilinoByUserId(user.id);
    if (!inquilino) {
      throw new ForbiddenException('Solo un inquilino puede subir documentos.');
    }

    const existente = await this.repo.findDocumentoByInquilinoAndTipo(
      inquilino.id,
      dto.tipoDocumento,
    );

    const archivoUrl = await this.storage.save(archivo);

    if (existente) {
      const oldUrl = existente.archivoUrl;

      existente.archivoUrl = archivoUrl;
      existente.estado = DocumentoEstado.PENDIENTE;
      existente.comentarioRechazo = null;

      const saved = await this.repo.saveDocumento(existente);

      await this.repo.saveAudit({
        documentoId: saved.id,
        documentoTipo: 'INQUILINO',
        action: DocumentoAuditAction.REEMPLAZADO,
        performedById: user.id,
        datosExtras: { oldUrl, newUrl: archivoUrl },
      });

      return saved;
    }

    const nuevo = await this.repo.saveDocumento({
      inquilino,
      archivoUrl,
      tipoDocumento: dto.tipoDocumento,
      estado: DocumentoEstado.PENDIENTE,
    });

    await this.repo.saveAudit({
      documentoId: nuevo.id,
      documentoTipo: 'INQUILINO',
      action: DocumentoAuditAction.CREADO,
      performedById: user.id,
    });

    return nuevo;
  }
}
