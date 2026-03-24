// backend\src\modules\propiedades\infrastructure\controllers\propiedades.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseIntPipe,
  BadRequestException,
} from '@nestjs/common';

import { Auth } from '../../../../common/decorators/auth.decorator';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import { User } from '../../../user/domain/entities/user.entity';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { Profiles } from '../../../../common/decorators/profiles.decorator';

import { UserRole, UserProfile } from '@shared/contracts';

import { CreatePropertyUseCase } from '../../application/use-cases/create-property.usecase';
import { UpdatePropertyUseCase } from '../../application/use-cases/update-property.usecase';
import { DeletePropertyUseCase } from '../../application/use-cases/delete-property.usecase';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.usecase';
import { ViewPropertyUseCase } from '../../application/use-cases/view-property.usecase';

import type { CreatePropertyDTO } from '../../application/dto/create-property.dto';
import type { UpdatePropertyDTO } from '../../application/dto/update-property.dto';

import { PropertyResponseMapper } from '../../application/dto/property-response.dto';

@Controller('propiedades')
export class PropiedadesController {
  constructor(
    private readonly createProperty: CreatePropertyUseCase,
    private readonly updateProperty: UpdatePropertyUseCase,
    private readonly deleteProperty: DeletePropertyUseCase,
    private readonly listProperties: ListPropertiesUseCase,
    private readonly viewProperty: ViewPropertyUseCase,
  ) {}

  @Post()
  @Profiles(UserProfile.PROPIETARIO, UserProfile.AGENCIA)
  async create(@Body() dto: CreatePropertyDTO, @CurrentUser() user: User) {
    if (!user?.id) throw new BadRequestException('Usuario no autenticado');

    const created = await this.createProperty.execute(dto, user.id);
    return PropertyResponseMapper.toResponse(created);
  }

  @Patch(':id')
  @Profiles(UserProfile.PROPIETARIO, UserProfile.AGENCIA)
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDTO,
  ) {
    const updated = await this.updateProperty.execute(id, dto);
    return PropertyResponseMapper.toResponse(updated);
  }

  @Delete(':id')
  @Roles(UserRole.SUPERADMIN)
  @Profiles(UserProfile.PROPIETARIO, UserProfile.AGENCIA)
  async delete(@Param('id', ParseIntPipe) id: number) {
    await this.deleteProperty.execute(id);
    return { message: 'Propiedad eliminada' };
  }

  @Get()
  async findAll(@Query() query: any) {
    const { items, total } = await this.listProperties.execute(
      {
        tipo: query.tipo,
        operacion: query.operacion,
        localidad: query.localidad,
      },
      Number(query.limit) || 20,
      Number(query.offset) || 0,
    );

    return {
      total,
      items: items.map(PropertyResponseMapper.toResponse),
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const p = await this.viewProperty.execute(id);
    return PropertyResponseMapper.toResponse(p);
  }
}