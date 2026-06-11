export interface PaginatedResponse<TResult> {
  readonly data: readonly TResult[];

  readonly page: number;

  readonly limit: number;

  readonly total: number;

  readonly totalPages: number;

  readonly hasNextPage: boolean;

  readonly hasPreviousPage: boolean;
}