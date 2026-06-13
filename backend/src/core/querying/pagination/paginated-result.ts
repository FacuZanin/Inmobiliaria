export interface PaginatedResultMeta {
  readonly total: number;
  readonly page: number;
  readonly limit: number;
  readonly totalPages: number;
  readonly hasNextPage: boolean;
  readonly hasPrevPage: boolean;
}

export class PaginatedResult<TResult> {
  private constructor(
    readonly data: readonly TResult[],
    readonly meta: PaginatedResultMeta,
  ) {}

  static create<TResult>(
    data: readonly TResult[],
    total: number,
    page = 1,
    limit = 20,
  ): PaginatedResult<TResult> {
    const totalPages = Math.ceil(total / limit);

    return new PaginatedResult(data, {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    });
  }
}
