// backend\src\modules\propiedades\application\use-cases\moderation\list-properties-by-moderation-status.usecase.ts

import { Inject, Injectable } from '@nestjs/common';

import { PROPERTY_REPOSITORY } from '../../tokens';
import type { PropertyRepositoryPort } from '../../ports/property-repository.port';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';
import { OrderEnum } from '@shared/contracts/enums/order.enum';
import { PropertyAdminSortBy } from '@shared/contracts/enums/property-admin-sort-by.enum';

@Injectable()
export class ListPropertiesByModerationStatusUseCase {
  constructor(
    @Inject(PROPERTY_REPOSITORY)
    private readonly repo: PropertyRepositoryPort,
  ) {}

  async execute(params: {
    status?: PublicacionStatus;
    page?: number;
    limit?: number;
    sortBy?: PropertyAdminSortBy;
    order?: OrderEnum;
    search?: string;
    dateFrom?: string;
    dateTo?: string;
    agencyId?: number;
    verified?: boolean;
  }) {
    const {
      status,
      page = 1,
      limit = 20,
      sortBy = PropertyAdminSortBy.CREATED_AT,
      order = OrderEnum.DESC,
      search,
      dateFrom,
      dateTo,
      agencyId,
      verified,
    } = params;

    if (!status) {
      return this.repo.findPendingModeration({
        page,
        limit,
        sortBy,
        order,
        search,
        dateFrom,
        dateTo,
        agencyId,
        verified,
      });
    }

    return this.repo.findByModerationStatus(status, {
      page,
      limit,
      sortBy,
      order,
      search,
      dateFrom,
      dateTo,
      agencyId,
      verified,
    });
  }
}