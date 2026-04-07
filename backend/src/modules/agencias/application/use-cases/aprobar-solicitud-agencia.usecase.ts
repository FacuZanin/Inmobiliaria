// backend\src\modules\agencias\application\use-cases\aprobar-solicitud-agencia.usecase.ts
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';
import type { UserRepositoryPort } from '../../../user/application/ports/user-repository.port';

import { AgenciaSolicitudEstado } from '@shared/contracts/enums/agencia-solicitud-estado.enum';

import { UserProfile } from '@shared/contracts/enums/user-profile.enum';

import { AGENCIAS_REPOSITORY, AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';

import { USER_REPOSITORY } from '../../../user/application/tokens';

@Injectable()
export class AprobarSolicitudAgenciaUseCase {
  constructor(
    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly solicitudes: AgenciaSolicitudRepositoryPort,

    @Inject(AGENCIAS_REPOSITORY)
    private readonly agencias: AgenciasRepositoryPort,

    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,
  ) {}

  async execute(id: number) {
    const solicitud = await this.solicitudes.findOne(id);
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== AgenciaSolicitudEstado.PENDIENTE) {
      throw new BadRequestException('Solicitud ya procesada');
    }

    const nuevaAgencia = await this.agencias.create({
      nombre: `${solicitud.nombreTitular} Inmobiliaria`,
      direccion: '---',
      localidad: solicitud.provincia,
      email: solicitud.usuario.email,
      telefono: solicitud.usuario.telefono ?? '',
    });

    solicitud.usuario.profile = UserProfile.AGENCIA;
    solicitud.usuario.agencia = nuevaAgencia;
    await this.users.save(solicitud.usuario);

    solicitud.estado = AgenciaSolicitudEstado.APROBADA;
    return this.solicitudes.save(solicitud);
  }
}
