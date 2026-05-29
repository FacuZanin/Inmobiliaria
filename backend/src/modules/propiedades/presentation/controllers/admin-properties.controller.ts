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
import { Audit } from '@/shared/security/decorators/audit.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';
import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';
import { AuditAction } from '@shared/contracts/enums/audit-action.enum';
import { AuditEntity } from '@shared/contracts/enums/audit-entity.enum';

import { ApprovePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/approve-property.usecase';
import { RejectPropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/reject-property.usecase';
import { ObservePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/observe-property.usecase';
import { PausePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/pause-property.usecase';
import { ListPendingModerationUseCase } from '@modules/propiedades/application/use-cases/moderation/list-pending-moderation.usecase';
import { ListPropertiesByModerationStatusUseCase } from '@/modules/propiedades/application/use-cases/moderation/list-properties-by-moderation-status.usecase';

import { ObservarPublicacionDto } from '@/modules/propiedades/application/dto/observar-publicacion.dto';
import { AdminPropertiesQueryDto } from '@/modules/propiedades/application/dto/admin-properties-query.dto';

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
    private readonly listByModerationStatusUC: ListPropertiesByModerationStatusUseCase,
  ) {}

  @Get('pendientes')
  @Auth(Permission.PUBLICACION_READ_ALL)
  @ApiOperation({
    summary: 'Listar publicaciones pendientes de moderación',
  })
  pendientes(@Query() query: AdminPropertiesQueryDto) {
    return this.listPendingUC.execute(query);
  }

  @Patch(':id/aprobar')
  @Auth(Permission.PUBLICACION_APPROVE)
  @Audit({
    action: AuditAction.APPROVE_PUBLICACION,
    entity: AuditEntity.PROPERTY,
  })
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.approveUC.execute(id);
  }

  @Patch(':id/rechazar')
  @Auth(Permission.PUBLICACION_REJECT)
  @Audit({
    action: AuditAction.REJECT_PUBLICACION,
    entity: AuditEntity.PROPERTY,
  })
  rechazar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ObservarPublicacionDto,
  ) {
    return this.rejectUC.execute(id, dto.motivo);
  }

  @Patch(':id/observar')
  @Auth(Permission.PUBLICACION_OBSERVE)
  @Audit({
    action: AuditAction.UPDATE_PUBLICACION,
    entity: AuditEntity.PROPERTY,
  })
  observar(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ObservarPublicacionDto,
  ) {
    return this.observeUC.execute(id, dto.motivo);
  }

  @Patch(':id/pausar')
  @Auth(Permission.PUBLICACION_PAUSE)
  @Audit({
    action: AuditAction.PAUSE_PUBLICACION,
    entity: AuditEntity.PROPERTY,
  })
  pausar(@Param('id', ParseIntPipe) id: number) {
    return this.pauseUC.execute(id);
  }

  @Get()
  @Auth(Permission.PUBLICACION_READ_ALL)
  @ApiOperation({
    summary: 'Listar publicaciones por estado de moderación',
  })
  findAll(@Query() query: AdminPropertiesQueryDto) {
    return this.listByModerationStatusUC.execute(query);
  }
}
