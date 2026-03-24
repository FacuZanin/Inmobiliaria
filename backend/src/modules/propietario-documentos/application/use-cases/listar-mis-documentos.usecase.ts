// backend\src\modules\propietario-documentos\application\use-cases\listar-mis-documentos.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import type { User } from '../../../user/domain/entities/user.entity';
import { PROPIETARIO_DOCUMENTOS_REPOSITORY } from '../tokens';
import type { PropietarioDocumentosRepositoryPort } from '../ports/propietario-documentos-repository.port';

@Injectable()
export class ListarMisDocumentosPropietarioUseCase {
  constructor(
    @Inject(PROPIETARIO_DOCUMENTOS_REPOSITORY)
    private readonly repo: PropietarioDocumentosRepositoryPort,
  ) {}

  async execute(user: User) {
    const owner = await this.repo.findOwnerById(user.id);
    if (!owner) return [];
    return this.repo.listByPropietario(owner.id);
  }
}
