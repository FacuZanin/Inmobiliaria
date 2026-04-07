// backend\src\modules\agencias\infrastructure\controllers\agencias.controller.ts
import { Controller, Post, Body, Get, Param, Patch } from '@nestjs/common';

import { Roles } from '../../../../shared/security/decorators/roles.decorator';
import { UserRole } from '@shared/contracts/enums/user-role.enum';

import { CreateAgenciaDto } from '../../application/dto/create-agencia.dto';
import { UpdateAgenciaDto } from '../../application/dto/update-agencia.dto';

import { CreateAgenciaUseCase } from '../../application/use-cases/create-agencia.usecase';
import { ListarSolicitudesUseCase } from '../../application/use-cases/listar-solicitudes.usecase';
import { ObtenerAgenciaUseCase } from '../../application/use-cases/obtener-agencia.usecase';
import { UpdateAgenciaUseCase } from '../../application/use-cases/update-agencia.usecase';

@Controller('agencias')
@Roles(UserRole.SUPERADMIN)
export class AgenciasController {
  constructor(
    private readonly createAgenciaUC: CreateAgenciaUseCase,
    private readonly listarSolicitudesUC: ListarSolicitudesUseCase,
    private readonly obtenerAgenciaUC: ObtenerAgenciaUseCase,
    private readonly updateAgenciaUC: UpdateAgenciaUseCase,
  ) {}

  @Post()
  create(@Body() dto: CreateAgenciaDto) {
    return this.createAgenciaUC.execute(dto);
  }

  @Get()
  list() {
    return this.listarSolicitudesUC.execute();
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.obtenerAgenciaUC.execute(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateAgenciaDto) {
    return this.updateAgenciaUC.execute(Number(id), dto);
  }
}
