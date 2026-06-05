// backend\src\modules\documents\infrastructure\mappers\document.mapper.ts
import { DocumentEntity } from '@/modules/documents/domain/entities/document.entity';
import { DocumentOwnerEntity } from '@/modules/documents/domain/entities/document-owner.entity';
import { DocumentVerificationEntity } from '@/modules/documents/domain/entities/document-verification.entity';

import { DocumentOrmEntity } from '@/modules/documents/infrastructure/persistence/typeorm/entities/document.orm-entity';

export class DocumentMapper {
  static toDomain(orm: DocumentOrmEntity): DocumentEntity {
    return DocumentEntity.hydrate({
      id: orm.id,

      owner: new DocumentOwnerEntity(orm.ownerId, orm.ownerType),

      type: orm.type,

      fileUrl: orm.fileUrl,

      verification: new DocumentVerificationEntity(
        orm.status,
        orm.reviewedBy,
        orm.reviewedAt,
        orm.rejectionReason,
      ),

      createdAt: orm.createdAt,
    });
  }

  static toOrm(domain: DocumentEntity): DocumentOrmEntity {
    const orm = new DocumentOrmEntity();

    if (domain.id) {
      orm.id = domain.id;
    }

    orm.ownerId = domain.owner.ownerId;

    orm.ownerType = domain.owner.ownerType;

    orm.type = domain.type;

    orm.fileUrl = domain.fileUrl;

    orm.status = domain.verification.status;

    orm.reviewedBy = domain.verification.reviewedBy ?? null;

    orm.reviewedAt = domain.verification.reviewedAt ?? null;

    orm.rejectionReason = domain.verification.rejectionReason ?? null;

    orm.createdAt = domain.createdAt;

    return orm;
  }
}
