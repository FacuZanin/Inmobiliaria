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
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';

import { User } from '../../../user/domain/entities/user.entity';

import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { Roles } from '../../../../shared/security/decorators/roles.decorator';
import { Public } from '@/shared/security/decorators/public.decorator';

import { UserRole } from '@shared/contracts/enums/user-role.enum';
import { UserType } from '@shared/contracts/enums/user-type.enum';

import { PROPERTY_PUBLISHERS } from '@/modules/user/domain/capabilities/property-publishers';

import { CreatePropertyUseCase } from '../../application/use-cases/create-property.usecase';
import { UpdatePropertyUseCase } from '../../application/use-cases/update-property.usecase';
import { DeletePropertyUseCase } from '../../application/use-cases/delete-property.usecase';
import { ListPropertiesUseCase } from '../../application/use-cases/list-properties.usecase';
import { ViewPropertyUseCase } from '../../application/use-cases/view-property.usecase';

import { CreatePropertyDTO } from '../../application/dto/create-property.dto';
import { UpdatePropertyDTO } from '../../application/dto/update-property.dto';
import { FilterPropiedadesDto } from '../../application/dto/filter-propiedades.dto';
import { PropertyResponseDto } from '../../application/dto/property-response.dto';

import { PropertyResponseMapper } from '../../application/mappers/property-response.mapper';

import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';

import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Propiedades')
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
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Crear propiedad',
    description:
      'La agencia se resuelve automaticamente desde el usuario autenticado cuando el perfil la requiere.',
  })
  @ApiOkResponse({
    type: PropertyResponseDto,
  })
  async create(@Body() dto: CreatePropertyDTO, @CurrentUser() user: User) {
    if (!user?.id) {
      throw new BadRequestException('Usuario no autenticado');
    }

    if (!PROPERTY_PUBLISHERS.includes(user.tipo)) {
      throw new ForbiddenException(
        'Tu tipo de cuenta no puede publicar propiedades',
      );
    }

    const created = await this.createProperty.execute(dto, user);

    return PropertyResponseMapper.toResponse(created);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  @ApiOkResponse({
    type: PropertyResponseDto,
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDTO,
    @CurrentUser() user: User,
  ) {
    const updated = await this.updateProperty.execute(id, dto, user);
    return PropertyResponseMapper.toResponse(updated);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    await this.deleteProperty.execute(id, user);

    return {
      success: true,
      message: 'Propiedad eliminada correctamente',
    };
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: 'Listar propiedades',
  })
  async findAll(@Query() query: FilterPropiedadesDto) {
    const { items, pagination } = await this.listProperties.execute(
      query,
      query.limit,
      query.offset,
    );

    return {
      success: true,
      pagination,
      items: items.map(PropertyResponseMapper.toResponse),
    };
  }

  @Get(':id')
  @Public()
  @ApiOkResponse({
    type: PropertyResponseDto,
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const p = await this.viewProperty.execute(id);
    return PropertyResponseMapper.toResponse(p);
  }
}
