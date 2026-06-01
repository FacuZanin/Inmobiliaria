import { Injectable } from '@nestjs/common';

import { ListingAggregate } from '../aggregates/listing.aggregate';
import { ListingStatus } from '../enums/listing-status.enum';

@Injectable()
export class ListingRankingService {
  score(listing: ListingAggregate): number {
    const analytics = listing.analytics;
    const freshness = listing.createdAt
      ? Math.max(0, 30 - this.daysSince(listing.createdAt))
      : 0;
    const mediaBoost = Math.min(listing.media.length, 10) * 2;
    const activeBoost = listing.status === ListingStatus.ACTIVE ? 20 : 0;

    return (
      activeBoost +
      freshness +
      mediaBoost +
      analytics.viewsCount * 0.05 +
      analytics.favoritesCount * 2 +
      analytics.contactsCount * 3
    );
  }

  private daysSince(date: Date): number {
    return Math.floor((Date.now() - date.getTime()) / 86_400_000);
  }
}
