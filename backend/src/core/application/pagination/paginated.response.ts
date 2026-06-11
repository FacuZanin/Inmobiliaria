// backend/src/core/application/pagination/paginated.response.ts
import type { PaginationParams } from './pagination-params';

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  nextCursor?: string; // para cursor-based pagination
}

export interface PaginatedResponse<T> {
  data: readonly T[];
  meta: PaginationMeta;
}

// Factory helper para construir la meta sin calcular a mano
export function buildPaginationMeta(
  total: number,
  params: Required<Pick<PaginationParams, 'page' | 'limit'>>,
  nextCursor?: string,
): PaginationMeta {
  const totalPages = Math.ceil(total / params.limit);
  return {
    total,
    page: params.page,
    limit: params.limit,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPrevPage: params.page > 1,
    nextCursor,
  };
}
