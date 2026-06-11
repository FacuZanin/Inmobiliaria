export const CURSOR_DIRECTIONS = {
  FORWARD: 'forward',

  BACKWARD: 'backward',
} as const;

export type CursorDirection =
  (typeof CURSOR_DIRECTIONS)[keyof typeof CURSOR_DIRECTIONS];