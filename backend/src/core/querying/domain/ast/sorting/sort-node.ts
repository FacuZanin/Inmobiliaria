import { SortDirection } from './sort-direction';

export interface SortNode<TField extends string = string> {
  readonly field: TField;

  readonly direction: SortDirection;
}
