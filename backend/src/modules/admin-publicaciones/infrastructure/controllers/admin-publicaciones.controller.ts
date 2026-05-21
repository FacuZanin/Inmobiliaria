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

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { AdminListPublicacionesUseCase } from '../../application/use-cases/admin-list-publicaciones.usecase';

import { ApprovePublicacionUseCase } from '@/modules/publicaciones/application/use-cases/approve-publicacion.usecase';
import { RejectPublicacionUseCase } from '@/modules/publicaciones/application/use-cases/reject-publicacion.usecase';
import { ObservePublicacionUseCase } from '@/modules/publicaciones/application/use-cases/observe-publicacion.usecase';
import { PausePublicacionUseCase } from '@/modules/publicaciones/application/use-cases/pause-publicacion.usecase';

import { FilterPublicacionesDto } from '../../application/dto/filter-publicaciones.dto';

@ApiTags('Admin - Publicaciones')
@ApiBearerAuth('access-token')
@Auth(UserRole.SUPERADMIN)
@Controller('admin/publicaciones')
export class AdminPublicacionesController {
  constructor(
    private readonly listUC: AdminListPublicacionesUseCase,
    private readonly approveUC: ApprovePublicacionUseCase,
    private readonly rejectUC: RejectPublicacionUseCase,
    private readonly observeUC: ObservePublicacionUseCase,
    private readonly pauseUC: PausePublicacionUseCase,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Listado administrativo de publicaciones',
  })
  list(@Query() filters: FilterPublicacionesDto) {
    return this.listUC.execute(filters);
  }

  @Patch(':id/aprobar')
  aprobar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.approveUC.execute(id);
  }

  @Patch(':id/rechazar')
  rechazar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rejectUC.execute(id);
  }

  @Patch(':id/observar')
  observar(
    @Param('id', ParseIntPipe) id: number,
    @Body('motivo') motivo: string,
  ) {
    return this.observeUC.execute(id, motivo);
  }

  @Patch(':id/pausar')
  pausar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.pauseUC.execute(id);
  }
}