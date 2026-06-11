// backend/src/core/application/pagination/pagination-params.ts

export interface PaginationParams {
  page?: number; // offset-based: número de página (default 1)
  limit?: number; // items por página (default 20, max 100)
  cursor?: string; // cursor-based: token opaco para la siguiente página
}
