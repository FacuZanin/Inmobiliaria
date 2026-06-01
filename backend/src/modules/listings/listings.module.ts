// backend/src/modules/listings/listings.module.ts

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

// =====================================================
// ORM
// =====================================================

import { ListingOrmEntity } from './infrastructure/persistence/entities/listing.orm-entity';

import { ListingMediaOrmEntity } from './infrastructure/persistence/entities/listing-media.orm-entity';

// =====================================================
// REPOSITORIES
// =====================================================

import { ListingRepository } from './infrastructure/repositories/listing.repository';

// =====================================================
// SEARCH
// =====================================================

import { ListingSearchService } from './infrastructure/search/listing-search.service';

// =====================================================
// TOKENS
// =====================================================

import {
  LISTING_REPOSITORY,
  LISTING_SEARCH_SERVICE,
} from './application/tokens';

// =====================================================
// USE CASES
// =====================================================

import { CreateListingUseCase } from './application/use-cases/create-listing.usecase';

import { UpdateListingUseCase } from './application/use-cases/update-listing.usecase';

import { GetListingUseCase } from './application/use-cases/get-listing.usecase';

import { PublishListingUseCase } from './application/use-cases/publish-listing.usecase';

import { PauseListingUseCase } from './application/use-cases/pause-listing.usecase';

import { ArchiveListingUseCase } from './application/use-cases/archive-listing.usecase';

import { ModerateListingUseCase } from './application/use-cases/moderate-listing.usecase';

import { SearchListingsUseCase } from './application/use-cases/search-listings.usecase';
import { AttachMediaUseCase } from './application/use-cases/attach-media.usecase';
import { UpdateLocationUseCase } from './application/use-cases/update-location.usecase';
import { UpdatePricingUseCase } from './application/use-cases/update-pricing.usecase';

// =====================================================
// CONTROLLERS
// =====================================================

import { ListingPublicController } from './presentation/controllers/listing-public.controller';

import { ListingOwnerController } from './presentation/controllers/listing-owner.controller';
import { ListingAdminController } from './presentation/controllers/listing-admin.controller';
import { ModerationController } from './presentation/controllers/moderation.controller';

// =====================================================
// POLICIES
// =====================================================

import { ListingOwnershipPolicy } from './application/policies/listing-ownership.policy';
import { ListingModerationPolicy } from './application/policies/listing-moderation.policy';
import { ListingPublicationPolicy } from './application/policies/listing-publication.policy';

// =====================================================
// SERVICES
// =====================================================

import { ListingSlugGeneratorService } from './domain/services/listing-slug-generator.service';
import { ListingRankingService } from './domain/services/listing-ranking.service';
import { ListingSearchMetadataService } from './domain/services/listing-search-metadata.service';
import { ListingIndexingProcessor } from './infrastructure/queues/listing-indexing.processor';
import { ListingMediaProcessor } from './infrastructure/queues/listing-media.processor';
import { ListingEventsSubscriber } from './infrastructure/subscribers/listing-events.subscriber';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ListingOrmEntity,
      ListingMediaOrmEntity,
    ]),
  ],

  // =====================================================
  // CONTROLLERS
  // =====================================================

  controllers: [
    ListingPublicController,
    ListingOwnerController,
    ListingAdminController,
    ModerationController,
  ],

  // =====================================================
  // PROVIDERS
  // =====================================================

  providers: [
    // ===================================================
    // REPOSITORY
    // ===================================================

    {
      provide: LISTING_REPOSITORY,
      useClass: ListingRepository,
    },

    // ===================================================
    // SEARCH
    // ===================================================

    {
      provide: LISTING_SEARCH_SERVICE,
      useClass: ListingSearchService,
    },

    // ===================================================
    // DOMAIN SERVICES
    // ===================================================

    ListingSlugGeneratorService,
    ListingRankingService,
    ListingSearchMetadataService,

    // ===================================================
    // POLICIES
    // ===================================================

    ListingOwnershipPolicy,
    ListingModerationPolicy,
    ListingPublicationPolicy,

    // ===================================================
    // USE CASES
    // ===================================================

    CreateListingUseCase,

    UpdateListingUseCase,

    GetListingUseCase,

    PublishListingUseCase,

    PauseListingUseCase,

    ArchiveListingUseCase,

    ModerateListingUseCase,

    SearchListingsUseCase,

    AttachMediaUseCase,

    UpdateLocationUseCase,

    UpdatePricingUseCase,

    ListingIndexingProcessor,
    ListingMediaProcessor,
    ListingEventsSubscriber,
  ],

  // =====================================================
  // EXPORTS
  // =====================================================

  exports: [
    LISTING_REPOSITORY,
    LISTING_SEARCH_SERVICE,
  ],
})
export class ListingsModule {}
