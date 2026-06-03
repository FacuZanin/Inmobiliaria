// backend\src\modules\agencias\application\use-cases\listar-solicitudes.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';
import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import type { AgenciaSolicitud } from '../../domain/entities/agencia-solicitud.entity';

@Injectable()
export class ListarSolicitudesUseCase {
  constructor(
    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly repo: AgenciaSolicitudRepositoryPort,
  ) {}

  async execute(): Promise<AgenciaSolicitud[]> {
    return this.repo.findPendientes();
  }
}
