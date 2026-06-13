export interface TranslatedQueryResult<TQuery = unknown> {
  readonly query: TQuery;

  readonly metadata?: {
    readonly requiresPagination?: boolean;

    readonly requiresSorting?: boolean;

    readonly requiresProjection?: boolean;

    readonly estimatedComplexity?: number;
  };
}
