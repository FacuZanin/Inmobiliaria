// backend\src\modules\publicaciones\application\services\moderation.service.ts
import { Injectable }
  from '@nestjs/common';

import { PublicacionStatus }
  from '@shared/contracts/enums/publicacion-status.enum';

@Injectable()
export class ModerationService {
  async generateInitialStatus({
    dto,
    uploads,
  }: {
    dto: any;

    uploads: string[];
  }) {
    let score = 100;

    const notes: string[] = [];

    // ---------------------------------------------------
    // VALIDACIONES BÁSICAS
    // ---------------------------------------------------

    if (!dto.descripcion) {
      score -= 20;

      notes.push(
        'La publicación no tiene descripción',
      );
    }

    if (!uploads?.length) {
      score -= 40;

      notes.push(
        'La publicación no tiene imágenes',
      );
    }

    if (
      dto.descripcion &&
      dto.descripcion.length < 20
    ) {
      score -= 10;

      notes.push(
        'Descripción demasiado corta',
      );
    }

    // ---------------------------------------------------
    // STATUS AUTOMÁTICO
    // ---------------------------------------------------

    let status =
      PublicacionStatus.EN_REVISION;

    if (score < 50) {
      status =
        PublicacionStatus.OBSERVADA;
    }

    return {
      status,

      score,

      notes:
        notes.length > 0
          ? notes.join(', ')
          : null,
    };
  }
}