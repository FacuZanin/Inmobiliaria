// backend\src\modules\operaciones\operaciones.controller.ts
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import { Auth } from '../../shared/security/decorators/auth.decorator';
import { CurrentUser } from '../../shared/security/decorators/current-user.decorator';
import { Roles } from '../../shared/security/decorators/roles.decorator';
import { Profiles } from '../../shared/security/decorators/profiles.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserProfile } from '@shared/contracts/dist/enums/user-type.enum';

import { User } from '../user/domain/entities/user.entity';

import { CreateOperacionDto } from './application/dto/create-operacion.dto';
import { UpdateOperacionDto } from './application/dto/update-operacion.dto';
import { FilterOperacionesDto } from './application/dto/filter-operaciones.dto';

// USE CASES
import { CreateOperacionUseCase } from './application/use-cases/create-operacion.usecase';
import { ListOperacionesUseCase } from './application/use-cases/list-operaciones.usecase';
import { FindOperacionByIdUseCase } from './application/use-cases/find-operacion-by-id.usecase';
import { UpdateOperacionUseCase } from './application/use-cases/update-operacion.usecase';
import { ReservarOperacionUseCase } from './application/use-cases/reservar-operacion.usecase';
import { ProcesarOperacionUseCase } from './application/use-cases/procesar-operacion.usecase';
import { FinalizarOperacionUseCase } from './application/use-cases/finalizar-operacion.usecase';
import { CancelarOperacionUseCase } from './application/use-cases/cancel-operacion.usecase';

@Controller('operaciones')
@Roles(UserRole.SUPERADMIN)
@Profiles(UserProfile.AGENCIA)
export class OperacionesController {
  constructor(
    private readonly createOperacion: CreateOperacionUseCase,
    private readonly listOperaciones: ListOperacionesUseCase,
    private readonly findOperacionById: FindOperacionByIdUseCase,
    private readonly updateOperacion: UpdateOperacionUseCase,
    private readonly reservarOperacion: ReservarOperacionUseCase,
    private readonly procesarOperacion: ProcesarOperacionUseCase,
    private readonly finalizarOperacion: FinalizarOperacionUseCase,
    private readonly cancelarOperacion: CancelarOperacionUseCase,
  ) {}

  // CREATE
  @Post()
  create(@Body() dto: CreateOperacionDto, @CurrentUser() user: User) {
    return this.createOperacion.execute(dto, user.id);
  }

  // READ
  @Get()
  findAll(@Query() filters: FilterOperacionesDto) {
    return this.listOperaciones.execute(filters);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.findOperacionById.execute(id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateOperacionDto,
  ) {
    return this.updateOperacion.execute(id, dto);
  }

  // DOMAIN ACTIONS
  @Patch(':id/reservar')
  reservar(@Param('id', ParseIntPipe) id: number) {
    return this.reservarOperacion.execute(id);
  }

  @Patch(':id/procesar')
  procesar(@Param('id', ParseIntPipe) id: number) {
    return this.procesarOperacion.execute(id);
  }

  @Patch(':id/finalizar')
  finalizar(@Param('id', ParseIntPipe) id: number) {
    return this.finalizarOperacion.execute(id);
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id', ParseIntPipe) id: number) {
    return this.cancelarOperacion.execute(id);
  }

  // DELETE
  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  remove(@Param('id', ParseIntPipe) id: number) {
    throw new Error('Delete no implementado aún');
  }
}
