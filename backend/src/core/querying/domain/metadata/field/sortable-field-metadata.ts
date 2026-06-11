// backend\src\core\querying\metadata\sorting\sortable-field-metadata.ts
import { QueryFieldMetadata } from './query-field-metadata';

export interface SortableFieldMetadata<
  TField extends string = string,
> extends QueryFieldMetadata<TField> {
  readonly sortable: true;
}