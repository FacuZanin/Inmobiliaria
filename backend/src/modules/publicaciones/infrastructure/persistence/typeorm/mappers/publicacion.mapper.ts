// backend\src\modules\publicaciones\infrastructure\persistence\typeorm\mappers\publicacion.mapper.ts
import { PublicacionAggregate }
  from '../../../../domain/entities/publicacion.aggregate';

import { PublicacionEntity }
  from '../entities/publicacion.entity';

export class PublicacionMapper {
  static toDomain(
    entity: PublicacionEntity,
  ): PublicacionAggregate {
    return PublicacionAggregate.rehydrate({
      id: entity.id,

      propertyId: entity.propertyId,

      status: entity.status,

      visible: entity.visible,

      verified: entity.verified,

      featured: entity.featured,

      moderationScore:
        entity.moderationScore,

      moderationNotes:
        entity.moderationNotes,

      publicadoEn: entity.publicadoEn,

      creadoEn: entity.creadoEn,
    });
  }

  static toOrm(
    aggregate: PublicacionAggregate,
  ): Partial<PublicacionEntity> {
    return {
      id: aggregate.id ?? undefined,

      propertyId: aggregate.propertyId,

      status: aggregate.status,

      visible: aggregate.visible,

      verified: aggregate.verified,

      featured: aggregate.featured,

      moderationScore:
        aggregate.moderationScore,

      moderationNotes:
        aggregate.moderationNotes,

      publicadoEn: aggregate.publicadoEn,

      creadoEn: aggregate.creadoEn,
    };
  }
}