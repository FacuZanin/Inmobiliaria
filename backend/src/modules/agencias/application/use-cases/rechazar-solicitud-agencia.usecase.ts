// backend\src\modules\agencias\application\use-cases\rechazar-solicitud-agencia.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';
import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import { AgenciaSolicitudEstado } from '@shared/enums/agencia-solicitud-estado.enum';

@Injectable()
export class RechazarSolicitudAgenciaUseCase {
  constructor(
    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly repo: AgenciaSolicitudRepositoryPort,
  ) {}

  async execute(id: number) {
    const solicitud = await this.repo.findOne(id);
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== AgenciaSolicitudEstado.PENDIENTE) {
      throw new BadRequestException('La solicitud ya fue procesada');
    }

    solicitud.estado = AgenciaSolicitudEstado.RECHAZADA;
    return this.repo.save(solicitud);
  }
}
