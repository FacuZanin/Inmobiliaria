// backend\src\modules\admin-publicaciones\application\use-cases\admin-reject-publicacion.usecase.ts
import { Injectable } from '@nestjs/common';

import { RejectPublicacionUseCase } from '@/modules/publicaciones/application/use-cases/reject-publicacion.usecase';

@Injectable()
export class AdminRejectPublicacionUseCase {
  constructor(
    private readonly rejectUC: RejectPublicacionUseCase,
  ) {}

  execute(id: number) {
    return this.rejectUC.execute(id);
  }
}