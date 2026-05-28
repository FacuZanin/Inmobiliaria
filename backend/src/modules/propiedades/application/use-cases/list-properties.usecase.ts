// backend\src\modules\propiedades\application\use-cases\list-properties.usecase.ts

// backend/src/modules/propiedades/application/use-cases/list-properties.usecase.ts

import { Inject, Injectable } from '@nestjs/common';

import { PROPERTY_REPOSITORY } from '../tokens';

import type { PropertyRepositoryPort } from '../ports/property-repository.port';

import { PublicPropertiesQueryDto } from '../dto/public-properties-query.dto';
import { PaginatedResponseDto } from '@/shared/application/dto/paginated-response.dto';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(query: PublicPropertiesQueryDto) {
    const result = await this.repo.findAll(query);

    return new PaginatedResponseDto(
      result.items,
      result.total,
      query.page,
      query.limit,
    );
  }
}
