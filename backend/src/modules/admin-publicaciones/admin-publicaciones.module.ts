// backend\src\modules\admin-publicaciones\admin-publicaciones.module.ts
import { Module } from '@nestjs/common';

import { PublicacionesModule } from '@/modules/publicaciones/publicaciones.module';

import { AdminPublicacionesController } from './infrastructure/controllers/admin-publicaciones.controller';

import { AdminListPublicacionesUseCase } from './application/use-cases/admin-list-publicaciones.usecase';

@Module({
  imports: [PublicacionesModule],

  controllers: [AdminPublicacionesController],

  providers: [AdminListPublicacionesUseCase],
})
export class AdminPublicacionesModule {}