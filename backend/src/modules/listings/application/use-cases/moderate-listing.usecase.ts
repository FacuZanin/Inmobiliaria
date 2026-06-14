import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { DOMAIN_EVENT_PUBLISHER } from '@/core/application/ports/domain-event-publisher.token';
import type { IDomainEventPublisher } from '@/core/domain/events/domain-event-publisher.interface';
import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';
import { ModerationStatus } from '../../domain/enums/moderation-status.enum';

import { ListingRepositoryPort } from '../../domain/repositories/listing.repository.port';
import { ListingModerationPolicy } from '../policies/listing-moderation.policy';

@Injectable()
export class ModerateListingUseCase {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly repository: ListingRepositoryPort,

    private readonly moderationPolicy: ListingModerationPolicy,

    @Inject(DOMAIN_EVENT_PUBLISHER)
    private readonly eventPublisher: IDomainEventPublisher,
  ) {}

  async execute(params: {
    listingId: number;
    status: ModerationStatus;
    reason?: string;
  }) {
    const listing =
      await this.repository.findById(
        params.listingId,
      );

    if (!listing) {
      throw new NotFoundException(
        'Listing not found',
      );
    }

    this.moderationPolicy.assertValidDecision(
      params.status,
      params.reason,
    );

    switch (params.status) {
      case ModerationStatus.APPROVED:
        listing.approveModeration();
        break;
      case ModerationStatus.REJECTED:
        listing.rejectModeration(params.reason!);
        break;
      case ModerationStatus.OBSERVED:
        listing.observeModeration(params.reason!);
        break;
      case ModerationStatus.SUSPENDED:
        listing.suspendModeration(params.reason!);
        break;
      case ModerationStatus.PENDING_REVIEW:
      case ModerationStatus.UNDER_REVIEW:
        listing.markAsUnderReview();
        break;
      default:
        throw new BadRequestException(
          'Unsupported moderation decision',
        );
    }

    const saved = await this.repository.save(listing);

    await this.eventPublisher.publish([
      {
        aggregateId: String(saved.id),
        occurredAt: new Date(),
        eventName: 'listing.moderated',
        payload: {
          listingId: saved.id!,
          ownerId: saved.ownerId,
          agencyId: saved.agencyId,
          status: saved.moderationStatus,
          reason: saved.moderationReason,
        },
      },
    ]);

    return saved;
  }
}
