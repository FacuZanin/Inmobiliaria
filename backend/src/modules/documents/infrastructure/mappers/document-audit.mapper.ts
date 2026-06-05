// backend\src\modules\documents\infrastructure\persistence\typeorm\mappers\document-audit.mapper.ts
import { DocumentAuditEntity } from '@modules/documents/domain/entities/document-audit.entity';

import { DocumentAuditOrmEntity } from '@modules/documents/infrastructure/persistence/typeorm/entities/document-audit.orm-entity';

export class DocumentAuditMapper {
  static toDomain(orm: DocumentAuditOrmEntity): DocumentAuditEntity {
    return new DocumentAuditEntity(
      orm.id,
      orm.documentId,
      orm.action,
      orm.performedBy,
      orm.metadata,
      orm.createdAt,
    );
  }

  static toOrm(domain: DocumentAuditEntity): DocumentAuditOrmEntity {
    const orm = new DocumentAuditOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.documentId = domain.documentId;
    orm.action = domain.action;
    orm.performedBy = domain.performedBy;
    orm.metadata = domain.metadata;

    return orm;
  }
}
