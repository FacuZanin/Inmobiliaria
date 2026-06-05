// backend/src/modules/agencias/infrastructure/controllers/admin-agencias.controller.ts

import {
  Controller,
  Get,
  Param,
  Patch,
  ParseIntPipe,
  Query,
  Delete,
  Body,
} from '@nestjs/common';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '@/core/security/decorators/auth.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';

// DTOs
import { FilterAgenciasDto } from '../../application/dto/filter-agencias.dto';
import { SuspenderAgenciaDto } from '../../application/dto/suspender-agencia.dto';

// Use Cases
import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.usecase';
import { AprobarSolicitudAgenciaUseCase } from '../../application/use-cases/aprobar-solicitud-agencia.usecase';
import { RechazarSolicitudAgenciaUseCase } from '../../application/use-cases/rechazar-solicitud-agencia.usecase';
import { ListarAgenciasUseCase } from '../../application/use-cases/listar-agencias.usecase';
import { SuspenderAgenciaUseCase } from '../../application/use-cases/suspender-agencia.usecase';
import { ReactivarAgenciaUseCase } from '../../application/use-cases/reactivar-agencia.usecase';
import { SoftDeleteAgenciaUseCase } from '../../application/use-cases/soft-delete-agencia.usecase';
import { RestoreAgenciaUseCase } from '../../application/use-cases/restore-agencia.usecase';
import { AdminDashboardUseCase } from '../../application/use-cases/admin-dashboard.usecase';

@ApiTags('Admin - Perfiles Profesionales')
@ApiBearerAuth('access-token')

@Auth(Permission.USER_MANAGE)

@Controller('admin/agencias')
export class AdminAgenciasController {
  constructor(
    private readonly listarSolicitudesUC: ListarSolicitudesUseCase,
    private readonly aprobarUC: AprobarSolicitudAgenciaUseCase,
    private readonly rechazarUC: RechazarSolicitudAgenciaUseCase,
    private readonly listarAgenciasUC: ListarAgenciasUseCase,
    private readonly suspenderAgenciaUC: SuspenderAgenciaUseCase,
    private readonly reactivarAgenciaUC: ReactivarAgenciaUseCase,
    private readonly softDeleteAgenciaUC: SoftDeleteAgenciaUseCase,
    private readonly restoreAgenciaUC: RestoreAgenciaUseCase,
    private readonly adminDashboardUC: AdminDashboardUseCase,
  ) {}

  @Get('dashboard')
  @ApiOperation({
    summary: 'Dashboard administrativo',
  })
  dashboard() {
    return this.adminDashboardUC.execute();
  }

  @Get('solicitudes')
  @ApiOperation({
    summary: 'Listar solicitudes pendientes de perfiles profesionales',
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
    summary: 'Aprobar solicitud de perfil profesional',
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
  aprobar(@Param('id', ParseIntPipe) id: number) {
    return this.aprobarUC.execute(id);
  }

  @Patch('solicitudes/:id/rechazar')
  @ApiOperation({
    summary: 'Rechazar solicitud de perfil profesional',
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
  rechazar(@Param('id', ParseIntPipe) id: number) {
    return this.rechazarUC.execute(id);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar agencias aprobadas',
  })
  listarAgencias(@Query() query: FilterAgenciasDto) {
    return this.listarAgenciasUC.execute({
      nombre: query.nombre,
      localidad: query.localidad,
      activa: query.activa !== undefined ? query.activa === 'true' : undefined,
      page: query.page ? Number(query.page) : 1,
      limit: query.limit ? Number(query.limit) : 10,
    });
  }
  @Patch(':id/suspender')
  suspender(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: SuspenderAgenciaDto,
  ) {
    return this.suspenderAgenciaUC.execute(id, dto.motivo);
  }

  @Patch(':id/reactivar')
  reactivar(@Param('id', ParseIntPipe) id: number) {
    return this.reactivarAgenciaUC.execute(id);
  }

  @Delete(':id')
  softDelete(@Param('id', ParseIntPipe) id: number) {
    return this.softDeleteAgenciaUC.execute(id);
  }

  @Patch(':id/restaurar')
  restore(@Param('id', ParseIntPipe) id: number) {
    return this.restoreAgenciaUC.execute(id);
  }
}
