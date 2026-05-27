// backend\src\modules\propiedades\presentation\controllers\admin-properties.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';

import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/shared/security/decorators/auth.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';
import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

import { ApprovePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/approve-property.usecase';
import { RejectPropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/reject-property.usecase';
import { ObservePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/observe-property.usecase';
import { PausePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/pause-property.usecase';
import { ListPendingModerationUseCase } from '@/modules/propiedades/application/use-cases/list-pending-moderation.usecase';
import { ObservarPublicacionDto } from '@/modules/propiedades/application/dto/observar-publicacion.dto';

@ApiTags('Admin - Propiedades')
@ApiBearerAuth('access-token')
@Controller('admin/propiedades')
export class AdminPropertiesController {
  constructor(
    private readonly approveUC: ApprovePropertyUseCase,
    private readonly rejectUC: RejectPropertyUseCase,
    private readonly observeUC: ObservePropertyUseCase,
    private readonly pauseUC: PausePropertyUseCase,
    private readonly listPendingUC: ListPendingModerationUseCase,
  ) {}

  @Get('pendientes')
  @Auth(Permission.PUBLICACION_READ_ALL)
  @ApiOperation({
    summary: 'Listar publicaciones pendientes de moderación',
  })
  pendientes(@Query('limit') limit?: string, @Query('offset') offset?: string) {
    return this.listPendingUC.execute(
      limit ? Number(limit) : 20,
      offset ? Number(offset) : 0,
    );
  }

  @Patch(':id/aprobar')
  @Auth(Permission.PUBLICACION_APPROVE)
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.approveUC.execute(id);
  }

  @Patch(':id/rechazar')
  @Auth(Permission.PUBLICACION_REJECT)
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ObservarPublicacionDto,
  ) {
    return this.rejectUC.execute(id, dto.motivo);
  }

  @Patch(':id/observar')
  @Auth(Permission.PUBLICACION_OBSERVE)
  observar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ObservarPublicacionDto,
  ) {
    return this.observeUC.execute(id, dto.motivo);
  }

  @Patch(':id/pausar')
  @Auth(Permission.PUBLICACION_PAUSE)
  pausar(@Param('id', ParseIntPipe) id: number) {
    return this.pauseUC.execute(id);
  }

  @Get()
  @Auth(Permission.PUBLICACION_READ_ALL)
  @ApiOperation({
    summary: 'Listar publicaciones por estado de moderación',
  })
  findAll(
    @Query('status') status?: PublicacionStatus,
    @Query('limit') limit?: string,
    @Query('offset') offset?: string,
  ) {
    return this.listByStatusUC.execute({
      status,
      limit: limit ? Number(limit) : 20,
      offset: offset ? Number(offset) : 0,
    });
  }
}
