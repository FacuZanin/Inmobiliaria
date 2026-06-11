// backend\src\modules\documents\application\queries\contracts\document-query-fields.ts
export const DOCUMENT_SORT_FIELDS = [
  'createdAt',
  'status',
  'type',
] as const;

export type DocumentSortableFields =
  typeof DOCUMENT_SORT_FIELDS[number];

export const DOCUMENT_FILTER_FIELDS = [
  'status',
  'type',
  'ownerId',
  'ownerType',
  'createdAt',
] as const;

export type DocumentFilterFields =
  typeof DOCUMENT_FILTER_FIELDS[number];