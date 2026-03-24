// backend\src\modules\inquilinos\inquilinos.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { InquilinosController } from './infrastructure/controllers/inquilinos.controller';

import { ActualizarPerfilUseCase } from './application/use-cases/actualizar-perfil.usecase';
import { AgregarFavoritoUseCase } from './application/use-cases/agregar-favorito.usecase';
import { CrearSolicitudVisitaUseCase } from './application/use-cases/crear-solicitud-visita.usecase';

import { InquilinosTypeOrmRepository } from './infrastructure/persistence/typeorm/inquilinos.typeorm.repository';

import { Inquilino } from './domain/entities/inquilino.entity';
import { SolicitudVisita } from './domain/entities/solicitud-visita.entity';
import { Favorito } from './domain/entities/favorito.entity';
import { Propiedad } from '../propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

import { INQUILINOS_REPOSITORY } from './application/tokens';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Inquilino,
      SolicitudVisita,
      Favorito,
      Propiedad,
    ]),
  ],
  controllers: [InquilinosController],
  providers: [
    ActualizarPerfilUseCase,
    AgregarFavoritoUseCase,
    CrearSolicitudVisitaUseCase,
    {
      provide: INQUILINOS_REPOSITORY,
      useClass: InquilinosTypeOrmRepository,
    },
  ],
})
export class InquilinosModule {}
