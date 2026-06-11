export const FILTER_GROUP_OPERATORS = {
  AND: 'and',
  OR: 'or',
} as const;
export type FilterGroupOperator =
  (typeof FILTER_GROUP_OPERATORS)[keyof typeof FILTER_GROUP_OPERATORS];
