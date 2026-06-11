export const SORT_DIRECTIONS = {
  ASC: 'asc',

  DESC: 'desc',
} as const;

export type SortDirection =
  (typeof SORT_DIRECTIONS)[keyof typeof SORT_DIRECTIONS];