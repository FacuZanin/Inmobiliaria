// backend/src/modules/listings/listings.module.ts

import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';



import { ListingOrmEntity } from './infrastructure/persistence/entities/listing.orm-entity';
import { ListingMediaOrmEntity } from './infrastructure/persistence/entities/listing-media.orm-entity';

import { ListingRepository } from './infrastructure/repositories/listing.repository';

import { ListingSearchService } from './infrastructure/search/listing-search.service';



import {
  LISTING_REPOSITORY,
  LISTING_SEARCH_SERVICE,
} from './application/tokens';


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

import { ListingPublicController } from './presentation/controllers/listing-public.controller';
import { ListingOwnerController } from './presentation/controllers/listing-owner.controller';
import { ListingAdminController } from './presentation/controllers/listing-admin.controller';
import { ModerationController } from './presentation/controllers/moderation.controller';

import { ListingOwnershipPolicy } from './application/policies/listing-ownership.policy';
import { ListingModerationPolicy } from './application/policies/listing-moderation.policy';
import { ListingPublicationPolicy } from './application/policies/listing-publication.policy';

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
  controllers: [
    ListingPublicController,
    ListingOwnerController,
    ListingAdminController,
    ModerationController,
  ],
  providers: [

    {
      provide: LISTING_REPOSITORY,
      useClass: ListingRepository,
    },

    {
      provide: LISTING_SEARCH_SERVICE,
      useClass: ListingSearchService,
    },

    ListingSlugGeneratorService,
    ListingRankingService,
    ListingSearchMetadataService,

    ListingOwnershipPolicy,
    ListingModerationPolicy,
    ListingPublicationPolicy,

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

  exports: [
    LISTING_REPOSITORY,
    LISTING_SEARCH_SERVICE,
  ],
})
export class ListingsModule {}
