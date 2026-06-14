import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DOMAIN_EVENT_PUBLISHER } from '@/core/application/ports/domain-event-publisher.token';
import type { IDomainEventPublisher } from '@/core/domain/events/domain-event-publisher.interface';
import { LISTING_REPOSITORY } from '@/modules/listings/application/tokens';
import { ListingStatus } from '@/modules/listings/domain/enums/listing-status.enum';
import type { ListingRepositoryPort } from '@/modules/listings/domain/repositories/listing.repository.port';
import { VisitEntity } from '@/modules/visits/domain/entities/visit.entity';
import { createVisitEvent } from '@/modules/visits/domain/events/visit-domain.event';
import { VisitRepositoryPort } from '@/modules/visits/domain/repositories/visit.repository.port';
import { VISIT_REPOSITORY } from '../tokens';

@Injectable()
export class RequestVisitUseCase {
  constructor(
    @Inject(VISIT_REPOSITORY)
    private readonly visitRepository: VisitRepositoryPort,

    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(input: {
    listingId: number;
    requesterId: number;
    desiredAt: Date;
    message?: string | null;
  }) {
    const listing = await this.listingRepository.findById(input.listingId);

    if (!listing) {
      throw new NotFoundException('Listing not found');
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new ConflictException('Only active listings can receive visit requests');
    }

    if (listing.ownerId === input.requesterId) {
      throw new ConflictException('You cannot request a visit for your own listing');
    }

    const saved = await this.visitRepository.save(
      VisitEntity.create({
        listingId: listing.id!,
        propertyId: listing.propertyId,
        requesterId: input.requesterId,
        ownerId: listing.ownerId,
        agencyId: listing.agencyId,
        desiredAt: input.desiredAt,
        message: input.message ?? null,
      }),
    );

    await this.eventPublisher.publish([
      createVisitEvent('visit.requested', {
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
