import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ListingsModule } from '@/modules/listings/listings.module';
import { VISIT_REPOSITORY } from './application/tokens';
import { AcceptVisitUseCase } from './application/use-cases/accept-visit.usecase';
import { CancelVisitUseCase } from './application/use-cases/cancel-visit.usecase';
import { ListMyVisitsUseCase } from './application/use-cases/list-my-visits.usecase';
import { ListOwnerVisitsUseCase } from './application/use-cases/list-owner-visits.usecase';
import { MarkVisitDoneUseCase } from './application/use-cases/mark-visit-done.usecase';
import { RejectVisitUseCase } from './application/use-cases/reject-visit.usecase';
import { RequestVisitUseCase } from './application/use-cases/request-visit.usecase';
import { RescheduleVisitUseCase } from './application/use-cases/reschedule-visit.usecase';
import { VisitAccessService } from './application/use-cases/visit-access.service';
import { VisitOrmEntity } from './infrastructure/persistence/typeorm/entities/visit.orm-entity';
import { VisitTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/visit.typeorm.repository';
import { OwnerVisitsController } from './presentation/http/controllers/owner-visits.controller';
import { VisitorVisitsController } from './presentation/http/controllers/visitor-visits.controller';

@Module({
  imports: [ListingsModule, TypeOrmModule.forFeature([VisitOrmEntity])],
  controllers: [VisitorVisitsController, OwnerVisitsController],
  providers: [
    VisitAccessService,
    RequestVisitUseCase,
    ListMyVisitsUseCase,
    ListOwnerVisitsUseCase,
    AcceptVisitUseCase,
    RejectVisitUseCase,
    CancelVisitUseCase,
    RescheduleVisitUseCase,
    MarkVisitDoneUseCase,
    {
      provide: VISIT_REPOSITORY,
      useClass: VisitTypeOrmRepository,
    },
  ],
  exports: [VISIT_REPOSITORY],
})
export class VisitsModule {}
