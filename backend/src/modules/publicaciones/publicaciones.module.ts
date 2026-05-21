import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicacionesController } from '@modules/publicaciones/presentation/controllers/publicaciones.controller';

import { PublicacionEntity } from '@modules/publicaciones/infrastructure/persistence/typeorm/entities/publicacion.entity';
import { PropertyEntity } from '@/modules/propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

import { PublicacionRepository } from '@modules/publicaciones/domain/repositories/publicacion.repository';

import { PublicacionTypeOrmRepository } from '@modules/publicaciones/infrastructure/persistence/typeorm/repositories/publicacion.typeorm.repository';

import { CreatePublicacionUseCase } from '@modules/publicaciones/application/use-cases/create-publicacion.usecase';
import { ApprovePublicacionUseCase } from '@modules/publicaciones/application/use-cases/approve-publicacion.usecase';
import { RejectPublicacionUseCase } from '@modules/publicaciones/application/use-cases/reject-publicacion.usecase';
import { ObservePublicacionUseCase } from '@modules/publicaciones/application/use-cases/observe-publicacion.usecase';
import { PausePublicacionUseCase } from '@modules/publicaciones/application/use-cases/pause-publicacion.usecase';

import { DocumentosService } from '@modules/publicaciones/application/services/documentos.service';
import { ModerationService } from '@modules/publicaciones/application/services/moderation.service';
import { ValidacionesService } from '@modules/publicaciones/application/services/validaciones.service';
import { PublicacionApplicationService } from '@modules/publicaciones/application/services/publicacion-application.service';

import { PropiedadesModule } from '@/modules/propiedades/propiedades.module';
import { UploadsModule } from '@/modules/uploads/uploads.module';
import { PropietarioDocumentosModule } from '@/modules/propietario-documentos/propietario-documentos.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([PublicacionEntity, PropertyEntity]),
    PropiedadesModule,
    UploadsModule,
    PropietarioDocumentosModule,
  ],

  controllers: [PublicacionesController],

  providers: [
    // USE CASES
    CreatePublicacionUseCase,
    ApprovePublicacionUseCase,
    RejectPublicacionUseCase,
    ObservePublicacionUseCase,
    PausePublicacionUseCase,

    // SERVICES
    DocumentosService,
    ModerationService,
    ValidacionesService,
    PublicacionApplicationService,

    // REPOSITORY
    {
      provide: PublicacionRepository,
      useClass: PublicacionTypeOrmRepository,
    },
  ],

  exports: [
    CreatePublicacionUseCase,
    ApprovePublicacionUseCase,
    RejectPublicacionUseCase,
    ObservePublicacionUseCase,
    PausePublicacionUseCase,
    PublicacionApplicationService,
    PublicacionRepository,
  ],
})
export class PublicacionesModule {}
