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

import { PropiedadesService } from './propiedades.service';
import { CreatePropiedadDto } from './dto/create-propiedad.dto';
import { UpdatePropiedadDto } from './dto/update-propiedad.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/user.entity/user.entity';

@Controller('propiedades')
@Auth(UserRole.ADMIN, UserRole.AGENCIA, UserRole.PROPIETARIO)
export class PropiedadesController {
  constructor(private readonly propiedadesService: PropiedadesService) {}

  @Post()
  create(
    @Body() data: CreatePropiedadDto,
    @CurrentUser() user: User,
  ) {
    return this.propiedadesService.create(data, user.id);
  }

  @Get()
  findAll() {
    return this.propiedadesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.propiedadesService.findOne(Number(id));
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdatePropiedadDto,
  ) {
    return this.propiedadesService.update(Number(id), data);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.propiedadesService.delete(Number(id));
  }
}
