// backend\src\modules\admin-publicaciones\application\use-cases\admin-pause-publicacion.usecase.ts
import { Injectable } from '@nestjs/common';

import { PausePublicacionUseCase } from '@/modules/publicaciones/application/use-cases/pause-publicacion.usecase';

@Injectable()
export class AdminPausePublicacionUseCase {
  constructor(
    private readonly pauseUC: PausePublicacionUseCase,
  ) {}

  execute(id: number) {
    return this.pauseUC.execute(id);
  }
}