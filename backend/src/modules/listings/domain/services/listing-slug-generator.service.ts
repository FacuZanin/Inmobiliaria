// backend/src/modules/listings/domain/services/listing-slug-generator.service.ts

import {
  Inject,
  Injectable,
} from '@nestjs/common';

import slugify from 'slugify';

import {
  LISTING_REPOSITORY,
} from '@modules/listings/application/tokens';

import type { ListingRepositoryPort } from '../repositories/listing.repository.port';

import { OperationType } from '../enums/operation-type.enum';

import { PropertyType } from '../enums/property-type.enum';

@Injectable()
export class ListingSlugGeneratorService {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,
  ) {}

  async generate(params: {
    title: string;

    city?: string | null;

    propertyType: PropertyType;

    operationType: OperationType;
  }): Promise<string> {
    // =====================================================
    // BUILD SEO BASE
    // =====================================================

    const parts = [
      params.propertyType,
      params.operationType,
      params.city,
      params.title,
    ]
      .filter(Boolean)
      .join(' ');

    // =====================================================
    // SLUGIFY
    // =====================================================

    const baseSlug = slugify(parts, {
      lower: true,
      strict: true,
      trim: true,
      locale: 'es',
    });

    // =====================================================
    // UNIQUE TOKEN
    // =====================================================

    const token =
      Math.random()
        .toString(36)
        .substring(2, 8);

    const slug =
      `${baseSlug}-${token}`;

    // =====================================================
    // SAFETY CHECK
    // =====================================================

    const exists =
      await this.listingRepository.existsBySlug(
        slug,
      );

    if (!exists) {
      return slug;
    }

    // edge-case ultra raro
    return `${slug}-${Date.now()}`;
  }
}