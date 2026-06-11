export const FILTER_OPERATORS = {
  EQ: 'eq',
  NEQ: 'neq',

  GT: 'gt',
  GTE: 'gte',

  LT: 'lt',
  LTE: 'lte',

  IN: 'in',
  NOT_IN: 'notIn',

  BETWEEN: 'between',

  CONTAINS: 'contains',
  STARTS_WITH: 'startsWith',
  ENDS_WITH: 'endsWith',

  IS_NULL: 'isNull',
  IS_NOT_NULL: 'isNotNull',
} as const;
export type FilterOperator =
  (typeof FILTER_OPERATORS)[keyof typeof FILTER_OPERATORS];