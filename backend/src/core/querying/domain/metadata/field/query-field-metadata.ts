// backend\src\core\querying\metadata\field\query-field-metadata.ts
import { QueryFieldOperator } from './query-field-operator';

import { QueryFieldType } from './query-field-type';

import { RelationMetadata } from './relation-metadata';

export interface QueryFieldMetadata<
  TField extends string = string,
> {
  readonly field: TField;

  readonly type: QueryFieldType;

  readonly databasePath: string;

  readonly filterable?: boolean;

  readonly sortable?: boolean;

  readonly selectable?: boolean;

  readonly nullable?: boolean;

  readonly sensitive?: boolean;

  readonly computed?: boolean;

  readonly allowedOperators?: readonly QueryFieldOperator[];

  readonly relation?: RelationMetadata;
}