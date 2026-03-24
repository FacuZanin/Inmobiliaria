// backend\src\modules\propietario-documentos\application\use-cases\documentos-aprobados.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { PROPIETARIO_DOCUMENTOS_REPOSITORY } from '../tokens';
import type { PropietarioDocumentosRepositoryPort } from '../ports/propietario-documentos-repository.port';

@Injectable()
export class DocumentosAprobadosPropietarioUseCase {
  constructor(
    @Inject(PROPIETARIO_DOCUMENTOS_REPOSITORY)
    private readonly repo: PropietarioDocumentosRepositoryPort,
  ) {}

  execute(propietarioId: number) {
    return this.repo.findAprobadosByPropietario(propietarioId);
  }
}
