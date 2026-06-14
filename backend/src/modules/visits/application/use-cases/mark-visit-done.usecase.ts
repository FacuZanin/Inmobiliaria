import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { DOMAIN_EVENT_PUBLISHER } from '@/core/application/ports/domain-event-publisher.token';
import type { IDomainEventPublisher } from '@/core/domain/events/domain-event-publisher.interface';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { createVisitEvent } from '@/modules/visits/domain/events/visit-domain.event';
import { VisitRepositoryPort } from '@/modules/visits/domain/repositories/visit.repository.port';
import { VISIT_REPOSITORY } from '../tokens';
import { VisitAccessService } from './visit-access.service';

@Injectable()
export class MarkVisitDoneUseCase {
  constructor(
    @Inject(VISIT_REPOSITORY)
    private readonly repository: VisitRepositoryPort,

    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: IDomainEventPublisher,

    private readonly access: VisitAccessService,
  ) {}

  async execute(id: number, user: JwtPayload & { id?: number }) {
    const visit = await this.repository.findById(id);

    if (!visit) throw new NotFoundException('Visit not found');

    this.access.assertOwner(user, visit);
    visit.markDone();

    const saved = await this.repository.save(visit);

    await this.eventPublisher.publish([
      createVisitEvent('visit.done', {
        visitId: saved.id,
        listingId: saved.listingId,
        propertyId: saved.propertyId,
        requesterId: saved.requesterId,
        ownerId: saved.ownerId,
        agencyId: saved.agencyId,
      }),
    ]);

    return saved;
  }
}
