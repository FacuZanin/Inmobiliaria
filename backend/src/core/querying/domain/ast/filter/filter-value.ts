export type FilterPrimitive =
  | string
  | number
  | boolean
  | null;

export type FilterValue =
  | FilterPrimitive
  | readonly FilterPrimitive[];