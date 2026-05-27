// backend/src/modules/propiedades/application/use-cases/list-pending-moderation.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { PROPERTY_REPOSITORY } from '../tokens';
import type { PropertyRepositoryPort } from '../ports/property-repository.port';

@Injectable()
export class ListPendingModerationUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(limit = 20, offset = 0) {
    const result = await this.repo.findPendingModeration({ limit, offset });

    return {
      items: result.items,
      pagination: {
        total: result.total,
        limit,
        offset,
        totalPages: Math.ceil(result.total / limit),
        hasNext: offset + limit < result.total,
        hasPrev: offset > 0,
      },
    };
  }
}
