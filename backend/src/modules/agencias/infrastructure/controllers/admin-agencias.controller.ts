// backend\src\modules\agencias\infrastructure\controllers\admin-agencias.controller.ts
import {
  Controller,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { Roles } from '../../../../shared/security/decorators/roles.decorator';
import { Auth } from '../../../../shared/security/decorators/auth.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.usecase';
import { AprobarSolicitudAgenciaUseCase } from '../../application/use-cases/aprobar-solicitud-agencia.usecase';
import { RechazarSolicitudAgenciaUseCase } from '../../application/use-cases/rechazar-solicitud-agencia.usecase';

@Auth(UserRole.SUPERADMIN)
@Controller('admin/agencias')
export class AdminAgenciasController {
  constructor(
    private readonly listarSolicitudesUC: ListarSolicitudesUseCase,
    private readonly aprobarUC: AprobarSolicitudAgenciaUseCase,
    private readonly rechazarUC: RechazarSolicitudAgenciaUseCase,
  ) {}

  @Get('solicitudes')
  @Roles(UserRole.SUPERADMIN)
  listar() {
    return this.listarSolicitudesUC.execute();
  }

  @Patch('solicitudes/:id/aprobar')
  @Roles(UserRole.SUPERADMIN)
  aprobar(@Param('id') id: string) {
    return this.aprobarUC.execute(Number(id));
  }

  @Patch('solicitudes/:id/rechazar')
  @Roles(UserRole.SUPERADMIN)
  rechazar(@Param('id') id: string) {
    return this.rechazarUC.execute(Number(id));
  }
}