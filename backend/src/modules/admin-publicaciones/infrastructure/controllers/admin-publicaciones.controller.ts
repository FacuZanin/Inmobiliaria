// backend\src\modules\admin-publicaciones\infrastructure\controllers\admin-publicaciones.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/shared/security/decorators/auth.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';

import { FilterPublicacionesDto } from '@modules/admin-publicaciones/application/dto/filter-publicaciones.dto';

import { AdminListPublicacionesUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-list-publicaciones.usecase';

import { AdminApprovePublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-approve-publicacion.usecase';
import { AdminRejectPublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-reject-publicacion.usecase';
import { AdminObservePublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-observe-publicacion.usecase';
import { AdminPausePublicacionUseCase } from '@modules/admin-publicaciones/application/use-cases/admin-pause-publicacion.usecase';

@ApiTags('Admin - Publicaciones')
@ApiBearerAuth('access-token')
@Controller('admin/publicaciones')
export class AdminPublicacionesController {
  constructor(
    private readonly listUC: AdminListPublicacionesUseCase,
    private readonly approveUC: AdminApprovePublicacionUseCase,
    private readonly rejectUC: AdminRejectPublicacionUseCase,
    private readonly observeUC: AdminObservePublicacionUseCase,
    private readonly pauseUC: AdminPausePublicacionUseCase,
  ) {}

  @Get()
  @Auth(Permission.PUBLICACION_READ_ALL)
  @ApiOperation({
    summary: 'Listado administrativo de publicaciones',
  })
  list(
    @Query() filters: FilterPublicacionesDto,
  ) {
    return this.listUC.execute(filters);
  }

  @Patch(':id/aprobar')
  @Auth(Permission.PUBLICACION_APPROVE)
  aprobar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.approveUC.execute(id);
  }

  @Patch(':id/rechazar')
  @Auth(Permission.PUBLICACION_REJECT)
  rechazar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rejectUC.execute(id);
  }

  @Patch(':id/observar')
  @Auth(Permission.PUBLICACION_OBSERVE)
  observar(
    @Param('id', ParseIntPipe) id: number,
    @Body('motivo') motivo: string,
  ) {
    return this.observeUC.execute(
      id,
      motivo,
    );
  }

  @Patch(':id/pausar')
  @Auth(Permission.PUBLICACION_PAUSE)
  pausar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pauseUC.execute(id);
  }
}