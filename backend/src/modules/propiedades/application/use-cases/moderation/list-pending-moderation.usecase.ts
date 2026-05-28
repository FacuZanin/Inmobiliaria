// backend\src\modules\propiedades\application\use-cases\moderation\list-pending-moderation.usecase.ts
import { Inject, Injectable } from '@nestjs/common';

import { PROPERTY_REPOSITORY } from '../../tokens';

import type { PropertyRepositoryPort } from '@modules/propiedades/application/ports/property-repository.port';

import { AdminPropertiesQueryDto } from '@modules/propiedades/application/dto/admin-properties-query.dto';

@Injectable()
export class ListPendingModerationUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(query: AdminPropertiesQueryDto) {
    return this.repo.findPendingModeration(query);
  }
}