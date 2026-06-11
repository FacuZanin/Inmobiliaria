// backend\src\core\querying\translation\typeorm\joins\typeorm-join-manager.ts
import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';

import { RelationMetadata } from '@/core/querying/domain/metadata/field/relation-metadata';

export class TypeOrmJoinManager<
  TEntity extends ObjectLiteral,
> {
  private readonly appliedJoins =
    new Set<string>();

  constructor(
    private readonly queryBuilder: SelectQueryBuilder<TEntity>,
  ) {}

  ensureJoin(
    relation: RelationMetadata,
  ): void {
    if (
      this.appliedJoins.has(
        relation.alias,
      )
    ) {
      return;
    }

    this.queryBuilder.leftJoin(
      relation.relation,
      relation.alias,
    );

    this.appliedJoins.add(
      relation.alias,
    );
  }
}
