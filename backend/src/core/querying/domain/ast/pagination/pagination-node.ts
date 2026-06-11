import { CursorPaginationNode } from './cursor/cursor-pagination-node';

import { OffsetPaginationNode } from './offset/offset-pagination-node';

export type PaginationNode =
  | OffsetPaginationNode
  | CursorPaginationNode;