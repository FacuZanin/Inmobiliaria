//backend\src\modules\publicaciones\publicaciones.module.ts
import { Module } from '@nestjs/common';

import { PublicacionesController } from './infrastructure/controllers/publicaciones.controller';

import { CreatePublicacionUseCase } from './use-cases/create-publicacion.usecase';

import { PropiedadesModule } from '@/modules/propiedades/propiedades.module';

import { PropietarioDocumentosModule } from '@/modules/propietario-documentos/propietario-documentos.module';

@Module({
  imports: [
    PropiedadesModule,
    PropietarioDocumentosModule,
  ],

  controllers: [PublicacionesController],

  providers: [CreatePublicacionUseCase],

  exports: [CreatePublicacionUseCase],
})
export class PublicacionesModule {}