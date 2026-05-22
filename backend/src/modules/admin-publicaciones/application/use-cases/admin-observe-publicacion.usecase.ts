// backend\src\modules\admin-publicaciones\application\use-cases\admin-observe-publicacion.usecase.ts
import { Injectable } from '@nestjs/common';

import { ObservePublicacionUseCase } from '@/modules/publicaciones/application/use-cases/observe-publicacion.usecase';

@Injectable()
export class AdminObservePublicacionUseCase {
  constructor(
    private readonly observeUC: ObservePublicacionUseCase,
  ) {}

  execute(
    id: number,
    motivo: string,
  ) {
    return this.observeUC.execute(
      id,
      motivo,
    );
  }
}