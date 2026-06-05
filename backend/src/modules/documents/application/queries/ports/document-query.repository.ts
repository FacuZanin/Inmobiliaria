// backend\src\modules\documents\application\queries\ports\document-query.repository.ts
import { PaginatedResponseDto } from '@/core/application/dto/paginated-response.dto';

import { DocumentListItemProjection } from '../projections/document-list-item.projection';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

export interface FindDocumentsQuery {
  page: number;
  
  limit: number;

  status?: DocumentStatus;

  ownerId?: number;

  ownerType?: DocumentOwnerType;

  sortBy?: string;

  sortOrder?: 'ASC' | 'DESC';
}

export interface DocumentQueryRepositoryPort {
  findMany(
    query: FindDocumentsQuery,
  ): Promise<PaginatedResponseDto<DocumentListItemProjection>>;
}
