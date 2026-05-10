// backend/src/modules/agencias/infrastructure/controllers/admin-agencias.controller.ts

import {
  Controller,
  Get,
  Param,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '../../../../shared/security/decorators/auth.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.usecase';

import { AprobarSolicitudAgenciaUseCase } from '../../application/use-cases/aprobar-solicitud-agencia.usecase';

import { RechazarSolicitudAgenciaUseCase } from '../../application/use-cases/rechazar-solicitud-agencia.usecase';

@ApiTags('Admin - Agencias')
@ApiBearerAuth('access-token')
@Auth(UserRole.SUPERADMIN)
@Controller('admin/agencias')
export class AdminAgenciasController {
  constructor(
    private readonly listarSolicitudesUC: ListarSolicitudesUseCase,

    private readonly aprobarUC: AprobarSolicitudAgenciaUseCase,

    private readonly rechazarUC: RechazarSolicitudAgenciaUseCase,
  ) {}

  @Get('solicitudes')
  @ApiOperation({
    summary: 'Listar solicitudes pendientes de agencias',
  })
  @ApiResponse({
    status: 200,
    description: 'Listado de solicitudes obtenido correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
  })
  listar() {
    return this.listarSolicitudesUC.execute();
  }

  @Patch('solicitudes/:id/aprobar')
  @ApiOperation({
    summary: 'Aprobar solicitud de agencia',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la solicitud',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud aprobada correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada',
  })
  aprobar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.aprobarUC.execute(id);
  }

  @Patch('solicitudes/:id/rechazar')
  @ApiOperation({
    summary: 'Rechazar solicitud de agencia',
  })
  @ApiParam({
    name: 'id',
    example: 1,
    description: 'ID de la solicitud',
  })
  @ApiResponse({
    status: 200,
    description: 'Solicitud rechazada correctamente',
  })
  @ApiResponse({
    status: 401,
    description: 'No autenticado',
  })
  @ApiResponse({
    status: 403,
    description: 'Sin permisos',
  })
  @ApiResponse({
    status: 404,
    description: 'Solicitud no encontrada',
  })
  rechazar(
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.rechazarUC.execute(id);
  }
}