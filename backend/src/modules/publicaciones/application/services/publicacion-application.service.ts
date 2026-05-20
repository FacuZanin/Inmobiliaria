// backend\src\modules\publicaciones\application\services\publicacion-application.service.ts
import {
  Injectable,
  Inject,
} from '@nestjs/common';

import { PublicacionAggregate }
  from '../../domain/entities/publicacion.aggregate';

import { PublicacionRepository }
  from '../../domain/repositories/publicacion.repository';

@Injectable()
export class PublicacionApplicationService {
  constructor(
    @Inject(PublicacionRepository)
    private readonly publicacionRepository:
      PublicacionRepository,
  ) {}

  async create({
    propertyId,
    moderation,
  }: {
    propertyId: number;

    moderation: {
      score?: number | null;

      notes?: string | null;
    };
  }) {
    // ---------------------------------------------------
    // AGGREGATE
    // ---------------------------------------------------

    const publicacion =
      PublicacionAggregate.create({
        propertyId,

        moderationScore:
          moderation.score ?? null,

        moderationNotes:
          moderation.notes ?? null,
      });

    // ---------------------------------------------------
    // WORKFLOW
    // ---------------------------------------------------

    publicacion.sendToReview();

    // ---------------------------------------------------
    // PERSISTENCIA
    // ---------------------------------------------------

    const saved =
      await this.publicacionRepository
        .save(publicacion);

    return saved;
  }
}