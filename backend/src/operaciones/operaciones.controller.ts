import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Delete,
  Query,
} from '@nestjs/common';

import { OperacionesService } from './operaciones.service';
import { CreateOperacionDto } from './dto/create-operacion.dto';
import { UpdateOperacionDto } from './dto/update-operacion.dto';
import { FilterOperacionesDto } from './dto/filter-operaciones.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/user.entity/user.entity';

@Controller('operaciones')
@Auth(UserRole.ADMIN, UserRole.AGENCIA, UserRole.EMPLEADO)
export class OperacionesController {
  constructor(private readonly operacionesService: OperacionesService) {}

  @Post()
  create(@Body() dto: CreateOperacionDto, @CurrentUser() user: User) {
    return this.operacionesService.create(dto, user);
  }

  @Get()
  findAll(@Query() filters: FilterOperacionesDto, @CurrentUser() user: User) {
    return this.operacionesService.findAll(filters, user);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @CurrentUser() user: User) {
    return this.operacionesService.findOne(Number(id), user);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateOperacionDto,
    @CurrentUser() user: User,
  ) {
    return this.operacionesService.update(Number(id), dto, user);
  }

  @Patch(':id/reservar')
  reservar(@Param('id') id: string, @CurrentUser() user: User) {
    return this.operacionesService.reservar(Number(id), user);
  }

  @Patch(':id/procesar')
  procesar(@Param('id') id: string, @CurrentUser() user: User) {
    return this.operacionesService.procesar(Number(id), user);
  }

@Patch(':id/finalizar')
  finalizar(@Param('id') id: string, @CurrentUser() user: User) {
    return this.operacionesService.finalizarEstado(Number(id), user); // ✅ Corregido
  }

  @Patch(':id/cancelar')
  cancelar(@Param('id') id: string, @CurrentUser() user: User) {
    return this.operacionesService.cancelar(Number(id), user);
  }

  @Delete(':id')
  @Auth(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.operacionesService.remove(Number(id));
  }
}
