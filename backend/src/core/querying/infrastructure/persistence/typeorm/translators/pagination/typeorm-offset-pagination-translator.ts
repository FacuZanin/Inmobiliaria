// backend/src/core/querying/translation/typeorm/pagination/typeorm-offset-pagination-translator.ts

import { SelectQueryBuilder } from 'typeorm';

import {
  deriveOffset,
  OffsetPaginationNode,
} from '@/core/querying/domain/ast/pagination/offset/offset-pagination-node';


export class TypeOrmOffsetPaginationTranslator<TEntity> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
  ) {}

  translate(pagination: OffsetPaginationNode): void {
    // FIX: usa deriveOffset() — pagination.offset no existe en el AST.
    // El cálculo (page - 1) * limit es responsabilidad del translator,
    // no del AST (que es agnóstico a SQL).
    this.queryBuilder.skip(deriveOffset(pagination));
    this.queryBuilder.take(pagination.limit);
  }
}