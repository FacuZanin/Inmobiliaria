// backend\src\modules\agencias\application\use-cases\solicitar-agencia.usecase.ts
import { Injectable, Inject } from '@nestjs/common';
import { AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';
import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import type { SolicitudAgenciaDto } from '../dto/solicitud-agencia.dto';
import type { User } from '../../../user/domain/entities/user.entity';
import { CrearSolicitudAgenciaDto } from '../dto/crear-solicitud-agencia.dto';

@Injectable()
export class SolicitarAgenciaUseCase {
  constructor(
    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly repo: AgenciaSolicitudRepositoryPort,
  ) {}

  execute(dto: CrearSolicitudAgenciaDto) {
    return this.repo.createBasic(dto);
  }
}
