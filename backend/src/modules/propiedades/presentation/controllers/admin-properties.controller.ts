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

import {
  ApiBearerAuth,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/shared/security/decorators/auth.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';

import { ApprovePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/approve-property.usecase';
import { RejectPropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/reject-property.usecase';
import { ObservePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/observe-property.usecase';
import { PausePropertyUseCase } from '@/modules/propiedades/application/use-cases/moderation/pause-property.usecase';

@ApiTags('Admin - Propiedades')
@ApiBearerAuth('access-token')
@Controller('admin/publicaciones')
export class AdminPublicacionesController {
  constructor(
    private readonly approveUC: ApprovePropertyUseCase,
    private readonly rejectUC: RejectPropertyUseCase,
    private readonly observeUC: ObservePropertyUseCase,
    private readonly pauseUC: PausePropertyUseCase,
  ) {}

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