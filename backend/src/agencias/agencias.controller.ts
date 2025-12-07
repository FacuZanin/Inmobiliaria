import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';

import { AgenciasService } from './agencias.service';
import { CreateAgenciaDto } from './dto/create-agencia.dto';
import { UpdateAgenciaDto } from './dto/update-agencia.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('agencias')
@Auth(UserRole.ADMIN)
export class AgenciasController {
  constructor(private readonly agenciasService: AgenciasService) {}

  @Post()
  create(@Body() createAgenciaDto: CreateAgenciaDto) {
    return this.agenciasService.create(createAgenciaDto);
  }

  @Get()
  findAll() {
    return this.agenciasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.agenciasService.findOne(Number(id));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAgenciaDto: UpdateAgenciaDto) {
    return this.agenciasService.update(Number(id), updateAgenciaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.agenciasService.remove(Number(id));
  }
}
