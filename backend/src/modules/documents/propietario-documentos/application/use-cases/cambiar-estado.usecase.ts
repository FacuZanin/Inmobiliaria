// backend\src\modules\propietario-documentos\application\use-cases\cambiar-estado.usecase.ts
import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { PROPIETARIO_DOCUMENTOS_REPOSITORY } from '../tokens';
import type { PropietarioDocumentosRepositoryPort } from '../ports/propietario-documentos-repository.port';
import { UpdateEstadoDocumentoDto } from '../dto/update-estado.dto';

@Injectable()
export class CambiarEstadoDocumentoPropietarioUseCase {
  constructor(
    @Inject(PROPIETARIO_DOCUMENTOS_REPOSITORY)
    private readonly repo: PropietarioDocumentosRepositoryPort,
  ) {}

  async execute(id: number, dto: UpdateEstadoDocumentoDto) {
    const doc = await this.repo.findById(id);
    if (!doc) throw new NotFoundException('Documento no encontrado');

    doc.estado = dto.estado;
    doc.comentarioRechazo = dto.comentarioRechazo ?? null;

    return this.repo.saveDocumento(doc);
  }
}
