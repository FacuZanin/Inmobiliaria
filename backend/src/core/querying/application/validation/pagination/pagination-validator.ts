import { CursorPaginationNode } from '@/core/querying/domain/ast/pagination/cursor/cursor-pagination-node';

import { OffsetPaginationNode } from '@/core/querying/domain/ast/pagination/offset/offset-pagination-node';

import { PaginationNode } from '@/core/querying/domain/ast/pagination/pagination-node';

import { InvalidPaginationException } from '../exceptions/invalid-pagination.exception';

export class PaginationValidator {
  constructor(
    private readonly maxLimit: number = 100,
  ) {}

  validate(
    pagination: PaginationNode,
  ): void {
    switch (pagination.type) {
      case 'offset':
        this.validateOffset(
          pagination,
        );

        return;

      case 'cursor':
        this.validateCursor(
          pagination,
        );

        return;
    }
  }

  private validateOffset(
    pagination: OffsetPaginationNode,
  ): void {
    if (pagination.page < 1) {
      throw new InvalidPaginationException(
        'Page must be greater than zero',
      );
    }

    this.validateLimit(
      pagination.limit,
    );
  }

  private validateCursor(
    pagination: CursorPaginationNode,
  ): void {
    this.validateLimit(
      pagination.limit,
    );
  }

  private validateLimit(
    limit: number,
  ): void {
    if (limit < 1) {
      throw new InvalidPaginationException(
        'Limit must be greater than zero',
      );
    }

    if (limit > this.maxLimit) {
      throw new InvalidPaginationException(
        `Limit exceeds maximum allowed value (${this.maxLimit})`,
      );
    }
  }
}