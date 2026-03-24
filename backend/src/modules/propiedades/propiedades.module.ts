// backend\src\modules\propiedades\propiedades.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  Propiedad,
  PropiedadCasa,
  PropiedadDepartamento,
  PropiedadLote,
  PropiedadLocal,
  PropiedadOficina,
  PropiedadCampo,
  PropiedadPH,
  PropiedadPozo,
} from './infrastructure/persistence/typeorm/entities/index';

import { PropiedadesController } from './infrastructure/controllers/propiedades.controller';

import { PropertyTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/property.typeorm.repository';
import { DocsCheckerImpl } from './infrastructure/docs/docs-checker.impl';

import { PROPERTY_REPOSITORY, DOCS_CHECKER } from './application/tokens';

import { CreatePropertyUseCase } from './application/use-cases/create-property.usecase';
import { UpdatePropertyUseCase } from './application/use-cases/update-property.usecase';
import { DeletePropertyUseCase } from './application/use-cases/delete-property.usecase';
import { ListPropertiesUseCase } from './application/use-cases/list-properties.usecase';
import { ViewPropertyUseCase } from './application/use-cases/view-property.usecase';

import { PropietarioDocumentosModule } from '../propietario-documentos/propietario-documentos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Propiedad,
      PropiedadCasa,
      PropiedadDepartamento,
      PropiedadLote,
      PropiedadLocal,
      PropiedadOficina,
      PropiedadCampo,
      PropiedadPH,
      PropiedadPozo,
    ]),
    PropietarioDocumentosModule,
  ],
  controllers: [PropiedadesController],
  providers: [
    // 🔌 ADAPTADORES
    {
      provide: PROPERTY_REPOSITORY,
      useClass: PropertyTypeOrmRepository,
    },
    {
      provide: DOCS_CHECKER,
      useClass: DocsCheckerImpl,
    },

    // 🧠 USE CASES
    CreatePropertyUseCase,
    UpdatePropertyUseCase,
    DeletePropertyUseCase,
    ListPropertiesUseCase,
    ViewPropertyUseCase,
  ],
  exports: [
    PROPERTY_REPOSITORY,
    CreatePropertyUseCase,
    UpdatePropertyUseCase,
    DeletePropertyUseCase,
    ListPropertiesUseCase,
    ViewPropertyUseCase,
  ],
})
export class PropiedadesModule {}
