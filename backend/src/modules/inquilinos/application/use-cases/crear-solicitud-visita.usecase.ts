// backend\src\modules\inquilinos\application\use-cases\crear-solicitud-visita.usecase.ts
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { INQUILINOS_REPOSITORY } from '../tokens';

import type { InquilinosRepositoryPort } from '../ports/inquilinos-repository.port';
import type { CrearSolicitudVisitaDTO } from '../dto/crear-solicitud-visita.dto';

@Injectable()
export class CrearSolicitudVisitaUseCase {
  constructor(
    @Inject(INQUILINOS_REPOSITORY)
    private readonly inquilinosRepository: InquilinosRepositoryPort,
  ) {}

  async execute(inquilinoId: number, dto: CrearSolicitudVisitaDTO) {
    const inquilino =
      await this.inquilinosRepository.findByUserId(inquilinoId);

    if (!inquilino) {
      throw new NotFoundException('Inquilino no encontrado');
    }

    inquilino.crearSolicitudVisita({
      propiedadId: dto.propiedadId,
      mensaje: dto.mensaje,
      fechaDeseada: new Date(dto.fechaDeseada),
    });

    await this.inquilinosRepository.save(inquilino);
  }
}
