// backend\src\modules\propiedades\propiedades.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
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
import { AdminPropertiesController } from './presentation/controllers/admin-properties.controller';

import { PropertyTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/property.typeorm.repository';

import { DocsCheckerImpl } from './infrastructure/docs/docs-checker.impl';

import {
  DOMAIN_EVENT_PUBLISHER,
  PROPERTY_REPOSITORY,
  DOCS_CHECKER,
} from './application/tokens';

import { CreatePropertyUseCase } from './application/use-cases/create-property.usecase';
import { UpdatePropertyUseCase } from './application/use-cases/update-property.usecase';
import { DeletePropertyUseCase } from './application/use-cases/delete-property.usecase';
import { ListPropertiesUseCase } from './application/use-cases/list-properties.usecase';
import { ViewPropertyUseCase } from './application/use-cases/view-property.usecase';
import { ApprovePropertyUseCase } from './application/use-cases/moderation/approve-property.usecase';
import { RejectPropertyUseCase } from './application/use-cases/moderation/reject-property.usecase';
import { ObservePropertyUseCase } from './application/use-cases/moderation/observe-property.usecase';
import { PausePropertyUseCase } from './application/use-cases/moderation/pause-property.usecase';
import { ListPropertiesByModerationStatusUseCase } from './application/use-cases/moderation/list-properties-by-moderation-status.usecase';
import { ListPendingModerationUseCase } from '@modules/propiedades/application/use-cases/moderation/list-pending-moderation.usecase';

import { PropietarioDocumentosModule } from '../documents/propietario-documentos/propietario-documentos.module';
import { SubscriptionsModule } from '../subscriptions/subscriptions.module';

import { PropertyApplicationService } from './application/services/property-application.service';

import { PropertyPublisherPolicy } from '@/core/security/policies/property-publisher.policy';
import { AuthorizationService } from '@/core/security/services/authorization.service';
import { PropertyOwnershipPolicy } from '@/core/security/policies/property-ownership.policy';
import { PublicacionOwnershipPolicy } from '@/core/security/policies/publicacion-ownership.policy';
import { UserOwnershipPolicy } from '@/core/security/policies/user-ownership.policy';
import { QueueDomainEventPublisher } from '@/core/infrastructure/events/queue-domain-event-publisher';
import { DOMAIN_EVENTS_QUEUE } from '@/core/infrastructure/queues/queues.constants';
import { DomainEventsProcessor } from './application/event-handlers/domain-events.processor';
import { PropertyPublishedHandler } from './application/event-handlers/property-published.handler';
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
    BullModule.registerQueue({
      name: DOMAIN_EVENTS_QUEUE,
    }),
    PropietarioDocumentosModule,
    SubscriptionsModule,
  ],
  controllers: [PropiedadesController, AdminPropertiesController],
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
    {
      provide: DOMAIN_EVENT_PUBLISHER,
      useClass: QueueDomainEventPublisher,
    },

    // USE CASES
    CreatePropertyUseCase,
    UpdatePropertyUseCase,
    DeletePropertyUseCase,
    ListPropertiesUseCase,
    ViewPropertyUseCase,
    ListPendingModerationUseCase,
    ApprovePropertyUseCase,
    RejectPropertyUseCase,
    ObservePropertyUseCase,
    PausePropertyUseCase,
    ListPropertiesByModerationStatusUseCase,
    // EVENT HANDLERS
    PropertyPublishedHandler,
    DomainEventsProcessor,
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
