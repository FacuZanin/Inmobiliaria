import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { PublicacionesController } from './presentation/controllers/publicaciones.controller';

import { CreatePublicacionUseCase } from './application/use-cases/create-publicacion.usecase';

import { PublicacionEntity } from './infrastructure/persistence/typeorm/entities/publicacion.entity';

import { PublicacionRepository } from './domain/repositories/publicacion.repository';
import { PublicacionTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/publicacion.typeorm.repository';

import { DocumentosService } from './application/services/documentos.service';
import { ModerationService } from './application/services/moderation.service';
import { ValidacionesService } from './application/services/validaciones.service';
import { PublicacionApplicationService } from './application/services/publicacion-application.service';

import { PropiedadesModule } from '@/modules/propiedades/propiedades.module';
import { UploadsModule } from '@/modules/uploads/uploads.module';
import { PropietarioDocumentosModule } from '@/modules/propietario-documentos/propietario-documentos.module';



@Module({
  imports: [
    TypeOrmModule.forFeature([PublicacionEntity]),
    PropiedadesModule,
    UploadsModule,
    PropietarioDocumentosModule,
  ],

  controllers: [PublicacionesController],

  providers: [
    CreatePublicacionUseCase,
    DocumentosService,
    ModerationService,
    ValidacionesService,
    PublicacionApplicationService,

    {
      provide: PublicacionRepository,

      useClass: PublicacionTypeOrmRepository,
    },
  ],

  exports: [
    CreatePublicacionUseCase,
    PublicacionRepository,
    PublicacionApplicationService,
  ],
})
export class PublicacionesModule {}
