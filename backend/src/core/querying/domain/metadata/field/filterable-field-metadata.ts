// backend\src\core\querying\metadata\filtering\filterable-field-metadata.ts
import { QueryFieldMetadata } from '../field/query-field-metadata';

import { QueryFieldOperator } from '../field/query-field-operator';

export interface FilterableFieldMetadata<
  TField extends string = string,
> extends QueryFieldMetadata<TField> {
  readonly filterable: true;

  readonly allowedOperators: readonly QueryFieldOperator[];
}