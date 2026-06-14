// backend\src\modules\agencias\application\use-cases\aprobar-solicitud-agencia.usecase.ts
import {
  Injectable,
  Inject,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

import { DOMAIN_EVENT_PUBLISHER } from '@/core/application/ports/domain-event-publisher.token';
import type { IDomainEventPublisher } from '@/core/domain/events/domain-event-publisher.interface';
import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';
import type { UserRepositoryPort } from '../../../users/application/ports/user-repository.port';
import { getUserTypeCapabilities } from '@/modules/users/domain/capabilities/property-publishers';

import { AgenciaSolicitudEstado } from '@shared/contracts/enums/agencia-solicitud-estado.enum';

import { AGENCIAS_REPOSITORY, AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';
import { USER_REPOSITORY } from '../../../users/application/tokens';

@Injectable()
export class AprobarSolicitudAgenciaUseCase {
  constructor(
    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly solicitudes: AgenciaSolicitudRepositoryPort,

    @Inject(AGENCIAS_REPOSITORY)
    private readonly agencias: AgenciasRepositoryPort,

    @Inject(USER_REPOSITORY)
    private readonly users: UserRepositoryPort,

    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(id: number) {
    const solicitud = await this.solicitudes.findOne(id);
    if (!solicitud) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    if (solicitud.estado !== AgenciaSolicitudEstado.PENDIENTE) {
      throw new BadRequestException('Solicitud ya procesada');
    }

    if (!solicitud.usuario) {
      throw new BadRequestException('La solicitud no tiene usuario asociado');
    }

    const requestedCapabilities = getUserTypeCapabilities(
      solicitud.tipoSolicitado,
    );

    if (solicitud.usuario.agencia) {
      throw new BadRequestException('El usuario ya pertenece a una agencia');
    }

    const nuevaAgencia = requestedCapabilities.requiresAgencyOnApproval
      ? await this.agencias.create({
          nombre: `${solicitud.nombreTitular} Inmobiliaria`,
          direccion: null,
          localidad: solicitud.provincia ?? null,
          email: solicitud.usuario.email ?? null,
          telefono: solicitud.usuario.telefono ?? null,
        })
      : null;

    solicitud.usuario.tipo = solicitud.tipoSolicitado;
    solicitud.usuario.agencia = nuevaAgencia;
    await this.users.save(solicitud.usuario);

    solicitud.estado = AgenciaSolicitudEstado.APROBADA;
    await this.solicitudes.save(solicitud);

    await this.eventPublisher.publish([
      {
        aggregateId: String(solicitud.id),
        occurredAt: new Date(),
        eventName: 'agency.request.approved',
        payload: {
          requestId: solicitud.id,
          userId: solicitud.usuario.id,
          userType: solicitud.usuario.tipo,
          agencyId: nuevaAgencia?.id ?? null,
        },
      },
    ]);

    return {
      message: 'Solicitud aprobada correctamente',
      data: {
        perfilAprobado: solicitud.tipoSolicitado,
        requiereAgencia: requestedCapabilities.requiresAgencyOnApproval,
        usuario: {
          id: solicitud.usuario.id,
          tipo: solicitud.usuario.tipo,
        },
        capacidades: requestedCapabilities,
        agencia: nuevaAgencia
          ? {
              id: nuevaAgencia.id,
              nombre: nuevaAgencia.nombre,
              localidad: nuevaAgencia.localidad,
            }
          : null,
      },
    };
  }
}
