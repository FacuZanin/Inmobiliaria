// backend\src\modules\publicaciones\application\services\publicacion-application.service.ts
import { Injectable, Inject } from '@nestjs/common';

import { PublicacionRepository } from '../../domain/repositories/publicacion.repository';

import { PublicacionAggregate } from '../../domain/entities/publicacion.aggregate';

@Injectable()
export class PublicacionApplicationService {
  constructor(
    @Inject(PublicacionRepository)
    private readonly publicacionRepository: PublicacionRepository,
  ) {}

  async create({
    propertyId,
    moderation,
  }: {
    propertyId: number;

    moderation: {
      status: string;
      score: number;
      notes?: string | null;
    };
  }) {
    // -----------------------------------------
    // AGGREGATE
    // -----------------------------------------

    const publicacion = PublicacionAggregate.create({
      propertyId,
    });

    // -----------------------------------------
    // MODERATION
    // -----------------------------------------

    publicacion.updateModerationScore(moderation.score);

    if (moderation.notes) {
      publicacion.updateModerationNotes(moderation.notes);
    }

    publicacion.publishAsPendingReview();

    // -----------------------------------------
    // SAVE
    // -----------------------------------------

    return this.publicacionRepository.save(publicacion);
  }

  async findById(id: number) {
    return this.publicacionRepository.findById(id);
  }

  async update(id: number, partial: Partial<PublicacionAggregate>) {
    return this.publicacionRepository.update(id, partial);
  }
}
