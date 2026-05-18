// backend\src\modules\agencias\application\use-cases\admin-dashboard.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { AGENCIAS_REPOSITORY } from '../tokens';

import type { AgenciasRepositoryPort } from '../ports/agencias-repository.port';
import type { AgenciaSolicitudRepositoryPort } from '../ports/agencia-solicitud-repository.port';
import type { UserRepositoryPort } from '@/modules/user/application/ports/user-repository.port';

import { AGENCIA_SOLICITUD_REPOSITORY } from '../tokens';
import { USER_REPOSITORY } from '@/modules/user/application/tokens';

import { AgenciaStatus } from '@shared/contracts/enums/agencia-status.enum';
import { AgenciaSolicitudEstado } from '@shared/contracts/enums/agencia-solicitud-estado.enum';

@Injectable()
export class AdminDashboardUseCase {
  constructor(
    @Inject(AGENCIAS_REPOSITORY)
    private readonly agenciasRepository: AgenciasRepositoryPort,

    @Inject(AGENCIA_SOLICITUD_REPOSITORY)
    private readonly solicitudesRepository: AgenciaSolicitudRepositoryPort,

    @Inject(USER_REPOSITORY)
    private readonly usersRepository: UserRepositoryPort,
  ) {}

  async execute() {
    const [
      totalAgencias,
      activas,
      suspendidas,
      eliminadas,

      solicitudesPendientes,
      solicitudesAprobadas,
      solicitudesRechazadas,

      usuariosAgencia,

      agenciasNuevasMes,
      usuariosNuevosMes,
      solicitudesMes,

      agenciasPorMes,
      usuariosPorMes,
      solicitudesPorMes,

      recentUsers,
      recentAgencias,
      recentSolicitudes,
    ] = await Promise.all([
      this.agenciasRepository.countAll(),

      this.agenciasRepository.countByStatus(AgenciaStatus.ACTIVA),

      this.agenciasRepository.countByStatus(AgenciaStatus.SUSPENDIDA),

      this.agenciasRepository.countDeleted(),

      this.solicitudesRepository.countByEstado(
        AgenciaSolicitudEstado.PENDIENTE,
      ),

      this.solicitudesRepository.countByEstado(AgenciaSolicitudEstado.APROBADA),

      this.solicitudesRepository.countByEstado(
        AgenciaSolicitudEstado.RECHAZADA,
      ),

      this.usersRepository.countProfessionalUsers(),

      this.agenciasRepository.countNewAgenciasThisMonth(),

      this.usersRepository.countNewUsersThisMonth(),

      this.solicitudesRepository.countThisMonth(),

      this.agenciasRepository.getAgenciasCreatedByMonth(),

      this.usersRepository.getUsersCreatedByMonth(),

      this.solicitudesRepository.getSolicitudesByMonth(),

      this.usersRepository.findRecentUsers(5),

      this.agenciasRepository.findRecentAgencias(5),

      this.solicitudesRepository.findRecent(5),
    ]);

    const totalProcessed = solicitudesAprobadas + solicitudesRechazadas;

    const tasaAprobacion =
      totalProcessed === 0
        ? 0
        : Number(((solicitudesAprobadas / totalProcessed) * 100).toFixed(2));

    return {
      overview: {
        totalAgencias,
        agenciasActivas: activas,
        agenciasSuspendidas: suspendidas,
        agenciasEliminadas: eliminadas,
        usuariosAgencia,
      },

      solicitudes: {
        pendientes: solicitudesPendientes,
        aprobadas: solicitudesAprobadas,
        rechazadas: solicitudesRechazadas,
        tasaAprobacion,
      },

      kpis: {
        agenciasNuevasMes,
        usuariosNuevosMes,
        solicitudesMes,
      },

      charts: {
        agenciasPorMes,
        usuariosPorMes,
        solicitudesPorMes,
      },

      moderacion: {
        suspendidas,
        pendientesRevision: solicitudesPendientes,
        rechazadas: solicitudesRechazadas,
        eliminadas,
      },

      actividadReciente: {
        usuarios: recentUsers,
        agencias: recentAgencias,
        solicitudes: recentSolicitudes,
      },
    };
  }
}
