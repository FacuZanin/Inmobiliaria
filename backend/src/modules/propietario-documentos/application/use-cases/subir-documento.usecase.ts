// backend\src\modules\propietario-documentos\application\use-cases\subir-documento.usecase.ts
import {
  Injectable,
  BadRequestException,
  ForbiddenException,
  NotFoundException,
  Inject,
} from '@nestjs/common';

import { DocumentoEstado } from '@shared/enums/documento-estado.enum';
import type { User } from '../../../user/domain/entities/user.entity';
import type { FileStoragePort } from '../../../uploads/application/ports/file-storage.port';
import type { PropietarioDocumentosRepositoryPort } from '../ports/propietario-documentos-repository.port';
import { CreateDocumentoDto } from '../dto/create-documento.dto';

import { PROPIETARIO_DOCUMENTOS_REPOSITORY } from '../tokens';
import { FILE_STORAGE } from '../../../uploads/application/tokens';

@Injectable()
export class SubirDocumentoPropietarioUseCase {
  constructor(
    @Inject(PROPIETARIO_DOCUMENTOS_REPOSITORY)
    private readonly repo: PropietarioDocumentosRepositoryPort,

    @Inject(FILE_STORAGE)
    private readonly storage: FileStoragePort,
  ) {}

  async execute(
    dto: CreateDocumentoDto,
    archivo: Express.Multer.File,
    user: User,
  ) {
    if (!archivo) throw new BadRequestException('Archivo requerido');

    const owner = await this.repo.findOwnerById(dto.propietarioId);
    if (!owner) throw new NotFoundException('Propietario no encontrado');

    const existente =
      await this.repo.findDocumentoByPropietarioAndTipo(
        dto.propietarioId,
        dto.tipoDocumento,
      );

    const archivoUrl = await this.storage.save(archivo);

    if (existente) {
      existente.archivoUrl = archivoUrl;
      existente.estado = DocumentoEstado.PENDIENTE;
      existente.comentarioRechazo = null;
      return this.repo.saveDocumento(existente);
    }

    return this.repo.saveDocumento({
      propietario: owner,
      propiedadId: dto.propiedadId ?? null,
      tipoDocumento: dto.tipoDocumento,
      archivoUrl,
      estado: DocumentoEstado.PENDIENTE,
      comentarioRechazo: null,
    });
  }
}
