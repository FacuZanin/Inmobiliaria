// backend\src\modules\inquilinos\application\use-cases\agregar-favorito.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INQUILINOS_REPOSITORY } from '../tokens';

import type { InquilinosRepositoryPort } from '../ports/inquilinos-repository.port';
import type { AgregarFavoritoDTO } from '../dto/agregar-favorito.dto';

@Injectable()
export class AgregarFavoritoUseCase {
  constructor(
    @Inject(INQUILINOS_REPOSITORY)
    private readonly inquilinosRepository: InquilinosRepositoryPort,
  ) {}

  async execute(userId: number, dto: AgregarFavoritoDTO): Promise<void> {
    const inquilino =
      await this.inquilinosRepository.findByUserId(userId);

    if (!inquilino) {
      throw new NotFoundException('Inquilino no encontrado');
    }

    inquilino.agregarFavorito(dto.propiedadId);

    await this.inquilinosRepository.save(inquilino);
  }
}
