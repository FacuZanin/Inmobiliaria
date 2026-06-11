export interface OffsetPaginationNode {
  readonly type: 'offset';

  /** Número de página base-1 (el cliente siempre ve 1-indexed). */
  readonly page: number;

  /** Cantidad máxima de registros por página. */
  readonly limit: number;
}

/**
 * Función utilitaria pura para derivar el offset SQL.
 * Ubicada aquí para evitar lógica dispersa en los translators.
 * No es parte del contrato público del AST.
 */
export function deriveOffset(node: OffsetPaginationNode): number {
  return (node.page - 1) * node.limit;
}