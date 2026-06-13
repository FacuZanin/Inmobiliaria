import type { SortDirection } from '../domain/ast/sorting/sort-direction';

export interface SortingParams<TField extends string = string> {
  readonly field?: TField;
  readonly direction?: SortDirection | 'ASC' | 'DESC';
  readonly sortBy?: TField;
  readonly sortOrder?: SortDirection | 'ASC' | 'DESC';
}
