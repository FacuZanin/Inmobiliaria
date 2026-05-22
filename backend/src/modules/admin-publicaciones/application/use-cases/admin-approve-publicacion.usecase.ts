// backend\src\modules\admin-publicaciones\application\use-cases\admin-approve-publicacion.usecase.ts
import { Injectable } from '@nestjs/common';

import { ApprovePublicacionUseCase } from '@/modules/publicaciones/application/use-cases/approve-publicacion.usecase';

@Injectable()
export class AdminApprovePublicacionUseCase {
  constructor(
    private readonly approveUC: ApprovePublicacionUseCase,
  ) {}

  execute(id: number) {
    return this.approveUC.execute(id);
  }
}