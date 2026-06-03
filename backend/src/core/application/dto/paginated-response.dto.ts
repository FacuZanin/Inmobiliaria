// backend\src\core\application\dto\paginated-response.dto.ts

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export class PaginatedResponseDto<T> {
  data: T[];
  meta: PaginationMeta;

  constructor(
    data: T[],
    total: number,
    page: number,
    limit: number,
  ) {
    const totalPages = Math.ceil(total / limit);

    this.data = data;

    this.meta = {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };
  }
}