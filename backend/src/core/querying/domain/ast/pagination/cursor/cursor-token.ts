// backend/src/core/querying/domain/ast/pagination/cursor/cursor-token.ts
export type CursorToken = string & {
  readonly __brand: 'CursorToken';
};