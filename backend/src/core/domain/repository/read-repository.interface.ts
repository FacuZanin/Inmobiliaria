// backend/src/core/domain/repository/read-repository.interface.ts
import type { Maybe } from '../../shared-kernel/types/maybe.type';
import type { PaginatedResponse } from '../../application/pagination/paginated.response';
import type { PaginationParams } from '../../application/pagination/pagination-params';

export interface IReadRepository<TDto> {
  findById(id: string): Promise<Maybe<TDto>>;
  findAll(params?: PaginationParams): Promise<PaginatedResponse<TDto>>;
}
