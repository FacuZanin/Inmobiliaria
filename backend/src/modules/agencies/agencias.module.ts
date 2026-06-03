// backend\src\modules\agencias\agencias.module.ts
import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';

import { User } from '../users/domain/entities/user.entity';
import { Agencia } from './domain/entities/agencia.entity';
import { AgenciaSolicitud } from './domain/entities/agencia-solicitud.entity';

// Controllers
import { AgenciasController } from './infrastructure/controllers/agencias.controller';
import { AdminAgenciasController } from './infrastructure/controllers/admin-agencias.controller';

// Infra Repositories
import { AgenciasTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/agencias.typeorm.repository';
import { AgenciaSolicitudTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/agencia-solicitud.typeorm.repository';

// Use Cases
import { CreateAgenciaUseCase } from './application/use-cases/create-agencia.usecase';
import { UpdateAgenciaUseCase } from './application/use-cases/update-agencia.usecase';
import { ObtenerAgenciaUseCase } from './application/use-cases/obtener-agencia.usecase';
import { ListarAgenciasUseCase } from './application/use-cases/listar-agencias.usecase';
import { SuspenderAgenciaUseCase } from './application/use-cases/suspender-agencia.usecase';
import { ReactivarAgenciaUseCase } from './application/use-cases/reactivar-agencia.usecase';
import { SoftDeleteAgenciaUseCase } from './application/use-cases/soft-delete-agencia.usecase';
import { RestoreAgenciaUseCase } from './application/use-cases/restore-agencia.usecase';
import { SolicitarAgenciaUseCase } from './application/use-cases/solicitar-agencia.usecase';
import { ListarSolicitudesUseCase } from './application/use-cases/listar-solicitudes.usecase';
import { AprobarSolicitudAgenciaUseCase } from './application/use-cases/aprobar-solicitud-agencia.usecase';
import { RechazarSolicitudAgenciaUseCase } from './application/use-cases/rechazar-solicitud-agencia.usecase';
import { AdminDashboardUseCase } from './application/use-cases/admin-dashboard.usecase';

import {
  AGENCIAS_REPOSITORY,
  AGENCIA_SOLICITUD_REPOSITORY,
} from './application/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([Agencia, AgenciaSolicitud, User]),
    forwardRef(() => UsersModule),
  ],
  controllers: [AgenciasController, AdminAgenciasController],
  providers: [
    {
      provide: AGENCIAS_REPOSITORY,
      useClass: AgenciasTypeOrmRepository,
    },
    {
      provide: AGENCIA_SOLICITUD_REPOSITORY,
      useClass: AgenciaSolicitudTypeOrmRepository,
    },

    // UseCases
    CreateAgenciaUseCase,
    UpdateAgenciaUseCase,
    ObtenerAgenciaUseCase,
    SolicitarAgenciaUseCase,
    ListarSolicitudesUseCase,
    AprobarSolicitudAgenciaUseCase,
    RechazarSolicitudAgenciaUseCase,
    ListarAgenciasUseCase,
    SuspenderAgenciaUseCase,
    ReactivarAgenciaUseCase,
    SoftDeleteAgenciaUseCase,
    RestoreAgenciaUseCase,
    AdminDashboardUseCase,
  ],
  exports: [AGENCIAS_REPOSITORY, SolicitarAgenciaUseCase],
})
export class AgenciasModule {}
