// backend\src\modules\propiedades\application\use-cases\list-properties.usecase.ts

import { Inject, Injectable } from '@nestjs/common';
import type { PropertyRepositoryPort } from '../ports/property-repository.port';
import { PropertyAggregate } from '../../domain/entities/property.aggregate';
import { PROPERTY_REPOSITORY } from '../tokens';

@Injectable()
export class ListPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(filters: any = {}, limit = 20, offset = 0): Promise<{ items: PropertyAggregate[]; total: number }> {
    const result = await this.repo.findAll(filters, { limit, offset });
    return { items: result.items, total: result.total };
  }
}
