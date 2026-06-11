export interface PaginationTranslator<
  TPagination,
> {
  translate(
    pagination: TPagination,
  ): void;
}