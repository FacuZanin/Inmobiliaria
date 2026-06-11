// backend\src\core\querying\metadata\field\query-field-type.ts
export const QUERY_FIELD_TYPES = {
  STRING: 'string',

  NUMBER: 'number',

  BOOLEAN: 'boolean',

  DATE: 'date',

  ENUM: 'enum',

  UUID: 'uuid',

  JSON: 'json',

  GEO_POINT: 'geoPoint',
} as const;

export type QueryFieldType =
  (typeof QUERY_FIELD_TYPES)[keyof typeof QUERY_FIELD_TYPES];