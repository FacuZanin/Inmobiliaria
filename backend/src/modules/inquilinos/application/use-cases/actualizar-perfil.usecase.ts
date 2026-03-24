// backend\src\modules\inquilinos\application\use-cases\actualizar-perfil.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INQUILINOS_REPOSITORY } from '../tokens';

import type { InquilinosRepositoryPort } from '../ports/inquilinos-repository.port';
import type { ActualizarPerfilDTO } from '../dto/actualizar-perfil.dto';

@Injectable()
export class ActualizarPerfilUseCase {
  constructor(
    @Inject(INQUILINOS_REPOSITORY)
    private readonly inquilinosRepository: InquilinosRepositoryPort,
  ) {}

  async execute(inquilinoId: number, dto: ActualizarPerfilDTO) {
    const inquilino =
      await this.inquilinosRepository.findByUserId(inquilinoId);

    if (!inquilino) {
      throw new NotFoundException('Inquilino no encontrado');
    }

    inquilino.actualizarPerfil(dto);

    await this.inquilinosRepository.save(inquilino);

    return inquilino;
  }
}
