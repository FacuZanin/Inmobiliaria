export interface SortingTranslator<
  TSorting,
> {
  translate(
    sorting: TSorting,
  ): void;
}