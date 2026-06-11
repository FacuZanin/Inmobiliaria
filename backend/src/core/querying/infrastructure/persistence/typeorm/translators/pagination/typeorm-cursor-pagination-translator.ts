// backend/src/core/querying/translation/typeorm/pagination/typeorm-cursor-pagination-translator.ts

import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { CursorPaginationNode } from '@/core/querying/domain/ast/pagination/cursor/cursor-pagination-node';
import { CursorEncoder } from '@/core/querying/domain/ast/pagination/cursor/cursor-encoder';
import { QueryMetadataRegistry } from '@/core/querying/domain/metadata/registries/query-metadata-registry';
import { TypeOrmJoinManager } from '../../joins/typeorm-join-manager';
import { SORT_DIRECTIONS } from '@/core/querying/domain/ast/sorting/sort-direction';
import { SortingNode } from '@/core/querying/domain/ast/sorting/sorting-node';


export class TypeOrmCursorPaginationTranslator<
  TEntity extends ObjectLiteral,
  TField extends string = string,
> {
  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
    private readonly registry: QueryMetadataRegistry<TField>,
    private readonly joins: TypeOrmJoinManager<TEntity>,
  ) {}

  translate(
    pagination: CursorPaginationNode,
    sorting?: SortingNode<TField>,
  ): void {
    if (pagination.after) {
      this.applyForwardCursor(pagination.after, sorting);
    } else if (pagination.before) {
      this.applyBackwardCursor(pagination.before, sorting);
    }

    // Pedimos limit+1 para detectar si hay siguiente página
    // sin hacer un COUNT(*) adicional. El executor descarta el registro extra.
    this.queryBuilder.take(pagination.limit + 1);
  }

  private applyForwardCursor(
    token: string,
    sorting?: SortingNode<TField>,
  ): void {
    const payload = CursorEncoder.decode(token as never);
    const sortField = sorting?.[0]?.field ?? 'id';
    const sortDirection = sorting?.[0]?.direction ?? SORT_DIRECTIONS.ASC;

    const fieldMetadata = this.registry.getField(sortField as TField);
    const sortPath = fieldMetadata?.databasePath ?? `${this.getAlias()}.id`;
    const idPath = `${this.getAlias()}.id`;

    if (sortField === 'id' || !fieldMetadata) {
      // Simple case: solo ordenamos por ID
      const operator = sortDirection === SORT_DIRECTIONS.ASC ? '>' : '<';
      this.queryBuilder.andWhere(`${idPath} ${operator} :cursorId`, {
        cursorId: payload.id,
      });
      return;
    }

    if (fieldMetadata.relation) {
      this.joins.ensureJoin(fieldMetadata.relation);
    }

    // Keyset pagination compuesta: (sort_field, id) > (cursor_value, cursor_id)
    // Esto garantiza ordering estable y consistente incluso con valores duplicados
    const operator = sortDirection === SORT_DIRECTIONS.ASC ? '>' : '<';
    this.queryBuilder.andWhere(
      `(${sortPath} ${operator} :cursorValue OR (${sortPath} = :cursorValue AND ${idPath} ${operator} :cursorId))`,
      {
        cursorValue: payload.value,
        cursorId: payload.id,
      },
    );
  }

  private applyBackwardCursor(
    token: string,
    sorting?: SortingNode<TField>,
  ): void {
    const payload = CursorEncoder.decode(token as never);
    const sortField = sorting?.[0]?.field ?? 'id';
    const sortDirection = sorting?.[0]?.direction ?? SORT_DIRECTIONS.ASC;

    const fieldMetadata = this.registry.getField(sortField as TField);
    const sortPath = fieldMetadata?.databasePath ?? `${this.getAlias()}.id`;
    const idPath = `${this.getAlias()}.id`;

    if (sortField === 'id' || !fieldMetadata) {
      const operator = sortDirection === SORT_DIRECTIONS.ASC ? '<' : '>';
      this.queryBuilder.andWhere(`${idPath} ${operator} :cursorId`, {
        cursorId: payload.id,
      });
      return;
    }

    if (fieldMetadata.relation) {
      this.joins.ensureJoin(fieldMetadata.relation);
    }

    // Backward: invertimos el operador
    const operator = sortDirection === SORT_DIRECTIONS.ASC ? '<' : '>';
    this.queryBuilder.andWhere(
      `(${sortPath} ${operator} :cursorValue OR (${sortPath} = :cursorValue AND ${idPath} ${operator} :cursorId))`,
      {
        cursorValue: payload.value,
        cursorId: payload.id,
      },
    );
  }

  private getAlias(): string {
    return this.queryBuilder.alias;
  }
}
