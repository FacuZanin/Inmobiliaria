import { CursorToken } from './cursor-token';

export interface CursorPaginationNode {
  readonly type: 'cursor';

  /** Límite de registros a retornar. Siempre > 0. */
  readonly limit: number;

  /**
   * Cursor opaco para navegación "hacia adelante" (next page).
   * Cuando presente: trae registros DESPUÉS de este cursor.
   */
  readonly after?: CursorToken;

  /**
   * Cursor opaco para navegación "hacia atrás" (previous page).
   * Cuando presente: trae registros ANTES de este cursor.
   */
  readonly before?: CursorToken;
}