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

import { UserType } from '@shared/contracts/enums/user-type.enum';
import { AgenciaSolicitudEstado } from '@shared/contracts/enums/agencia-solicitud-estado.enum';

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

    if (solicitud.usuario.agencia) {
      throw new BadRequestException('El usuario ya pertenece a una agencia');
    }

    const nuevaAgencia = await this.agencias.create({
      nombre: `${solicitud.nombreTitular} Inmobiliaria`,
      direccion: null,
      localidad: solicitud.provincia ?? null,
      email: solicitud.usuario.email ?? null,
      telefono: solicitud.usuario.telefono ?? null,
    });

    if (!solicitud.usuario) {
      throw new BadRequestException('La solicitud no tiene usuario asociado');
    }

    solicitud.usuario.tipo = UserType.AGENCIA;
    solicitud.usuario.agencia = nuevaAgencia;
    await this.users.save(solicitud.usuario);

    solicitud.estado = AgenciaSolicitudEstado.APROBADA;
    await this.solicitudes.save(solicitud);

    return {
      message: 'Solicitud aprobada correctamente',
      data: {
        id: nuevaAgencia.id,
        nombre: nuevaAgencia.nombre,
        localidad: nuevaAgencia.localidad,
        activa: nuevaAgencia.activa,
      },
    };
  }
}
