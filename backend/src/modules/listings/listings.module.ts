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

import { ListingRepository } from './infrastructure/persistence/repositories/listing.repository';

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

// =====================================================
// CONTROLLERS
// =====================================================

import { ListingPublicController } from './presentation/controllers/listing-public.controller';

import { ListingOwnerController } from './presentation/controllers/listing-owner.controller';

// =====================================================
// POLICIES
// =====================================================

import { ListingOwnershipPolicy } from './application/policies/listing-ownership.policy';

// =====================================================
// SERVICES
// =====================================================

import { ListingSlugGeneratorService } from './domain/services/listing-slug-generator.service';

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

    // ===================================================
    // POLICIES
    // ===================================================

    ListingOwnershipPolicy,

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