// backend\src\modules\admin-publicaciones\admin-publicaciones.module.ts
import { Module } from '@nestjs/common';

import { PublicacionesModule } from '@/modules/publicaciones/publicaciones.module';

import { AdminPublicacionesController } from '@modules/admin-publicaciones/infrastructure/controllers/admin-publicaciones.controller';

import { AdminListPublicacionesUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-list-publicaciones.usecase';
import { AdminApprovePublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-approve-publicacion.usecase';
import { AdminRejectPublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-reject-publicacion.usecase';
import { AdminObservePublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-observe-publicacion.usecase';
import { AdminPausePublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-pause-publicacion.usecase';

@Module({
  imports: [
    PublicacionesModule,
  ],

  controllers: [
    AdminPublicacionesController,
  ],

  providers: [
    AdminListPublicacionesUseCase,

    AdminApprovePublicacionUseCase,
    AdminRejectPublicacionUseCase,
    AdminObservePublicacionUseCase,
    AdminPausePublicacionUseCase,
  ],
})
export class AdminPublicacionesModule {}