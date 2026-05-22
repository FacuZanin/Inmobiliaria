// backend\src\modules\propiedades\propiedades.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import {
  PropertyEntity,
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
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { PropertyApplicationService } from './application/services/property-application.service';

import { PropertyPublisherPolicy } from '@/shared/security/policies/property-publisher.policy';
import { AuthorizationService } from '@/shared/security/services/authorization.service';
import { PropertyOwnershipPolicy } from '@/shared/security/policies/property-ownership.policy';
import { PublicacionOwnershipPolicy } from '@/shared/security/policies/publicacion-ownership.policy';
import { UserOwnershipPolicy } from '@/shared/security/policies/user-ownership.policy';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      PropertyEntity,
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
    SubscriptionsModule,
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

    // USE CASES
    CreatePropertyUseCase,
    UpdatePropertyUseCase,
    DeletePropertyUseCase,
    ListPropertiesUseCase,
    ViewPropertyUseCase,
    // SERVICES
    PropertyApplicationService,
    AuthorizationService,
    // POLICIES
    PropertyOwnershipPolicy,
    PublicacionOwnershipPolicy,
    UserOwnershipPolicy,
    PropertyPublisherPolicy,
  ],
  exports: [
    PROPERTY_REPOSITORY,
    CreatePropertyUseCase,
    UpdatePropertyUseCase,
    DeletePropertyUseCase,
    ListPropertiesUseCase,
    ViewPropertyUseCase,
    PropertyApplicationService,
  ],
})
export class PropiedadesModule {}
