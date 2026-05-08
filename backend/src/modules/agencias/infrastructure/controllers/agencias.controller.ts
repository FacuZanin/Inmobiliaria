//backend\src\modules\agencias\infrastructure\controllers\agencias.controller.ts
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
} from '@nestjs/common';

import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';

import type { User } from '../../../user/domain/entities/user.entity';

import { CreateAgenciaDto } from '../../application/dto/create-agencia.dto';
import { UpdateAgenciaDto } from '../../application/dto/update-agencia.dto';
import { SolicitudAgenciaDto } from '../../application/dto/create-solicitud-agencia.dto';

import { CreateAgenciaUseCase } from '../../application/use-cases/create-agencia.usecase';
import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.usecase';
import { ObtenerAgenciaUseCase } from '../../application/use-cases/obtener-agencia.usecase';
import { UpdateAgenciaUseCase } from '../../application/use-cases/update-agencia.usecase';
import { SolicitarAgenciaUseCase } from '../../application/use-cases/solicitar-agencia.usecase';

@Controller('agencias')
export class AgenciasController {
  constructor(
    private readonly createAgenciaUC: CreateAgenciaUseCase,
    private readonly listarSolicitudesUC: ListarSolicitudesUseCase,
    private readonly obtenerAgenciaUC: ObtenerAgenciaUseCase,
    private readonly updateAgenciaUC: UpdateAgenciaUseCase,
    private readonly solicitarUC: SolicitarAgenciaUseCase,
  ) {}

  // =========================
  // USER AUTENTICADO
  // =========================

  @Auth()
  @Post('solicitar')
  solicitar(
    @Body() dto: SolicitudAgenciaDto,
    @CurrentUser() user: User,
  ) {
    return this.solicitarUC.execute(dto, user.id);
  }

  // =========================
  // SOLO SUPERADMIN
  // =========================

  @Auth(UserRole.SUPERADMIN)
  @Get()
  list() {
    return this.listarSolicitudesUC.execute();
  }

  @Auth(UserRole.SUPERADMIN)
  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.obtenerAgenciaUC.execute(Number(id));
  }

  @Auth(UserRole.SUPERADMIN)
  @Post()
  create(@Body() dto: CreateAgenciaDto) {
    return this.createAgenciaUC.execute(dto);
  }

  @Auth(UserRole.SUPERADMIN)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgenciaDto) {
    return this.updateAgenciaUC.execute(Number(id), dto);
  }
}