import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { ChangePropertyStatusDto } from '@/modules/properties/application/dto/change-property-status.dto';
import { CreatePropertyDto } from '@/modules/properties/application/dto/create-property.dto';
import { SearchPropertiesDto } from '@/modules/properties/application/dto/search-properties.dto';
import { UpdatePropertyDto } from '@/modules/properties/application/dto/update-property.dto';
import { ChangePropertyStatusUseCase } from '@/modules/properties/application/use-cases/change-property-status.usecase';
import { CreatePropertyUseCase } from '@/modules/properties/application/use-cases/create-property.usecase';
import { DeletePropertyUseCase } from '@/modules/properties/application/use-cases/delete-property.usecase';
import { GetPropertyUseCase } from '@/modules/properties/application/use-cases/get-property.usecase';
import { SearchPropertiesUseCase } from '@/modules/properties/application/use-cases/search-properties.usecase';
import { UpdatePropertyUseCase } from '@/modules/properties/application/use-cases/update-property.usecase';
import { PropertyOwnershipPolicy } from '@/modules/properties/application/policies/property-ownership.policy';
import { PropertySerializer } from '../serializers/property.serializer';

@ApiTags('Owner Properties')
@Controller('owner/properties')
@Auth()
export class PropertyOwnerController {
  constructor(
    private readonly createProperty: CreatePropertyUseCase,
    private readonly getProperty: GetPropertyUseCase,
    private readonly searchProperties: SearchPropertiesUseCase,
    private readonly updateProperty: UpdatePropertyUseCase,
    private readonly changeStatus: ChangePropertyStatusUseCase,
    private readonly deleteProperty: DeletePropertyUseCase,
    private readonly ownershipPolicy: PropertyOwnershipPolicy,
  ) {}

  @Post()
  @Auth(Permission.PROPERTY_CREATE)
  @ApiOperation({ summary: 'Create property' })
  async create(@Body() dto: CreatePropertyDto, @CurrentUser() user: JwtPayload) {
    const property = await this.createProperty.execute(
      dto,
      user.sub,
      user.agencia?.id ?? null,
    );

    return PropertySerializer.serialize(property);
  }

  @Get()
  @ApiOperation({ summary: 'List own properties' })
  async list(@Query() filters: SearchPropertiesDto, @CurrentUser() user: JwtPayload) {
    const result = await this.searchProperties.execute({
      ...filters,
      ownerId: user.sub,
    });

    return PropertySerializer.serializePaginated(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get own property' })
  async findOne(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const property = await this.getProperty.execute(id);
    this.ownershipPolicy.assertCanManage(user, property);

    return PropertySerializer.serialize(property);
  }

  @Patch(':id')
  @Auth(Permission.PROPERTY_UPDATE)
  @ApiOperation({ summary: 'Update property' })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePropertyDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const property = await this.getProperty.execute(id);
    this.ownershipPolicy.assertCanManage(user, property);

    const updated = await this.updateProperty.execute(id, dto);

    return PropertySerializer.serialize(updated);
  }

  @Patch(':id/status')
  @Auth(Permission.PROPERTY_UPDATE)
  @ApiOperation({ summary: 'Change property status' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePropertyStatusDto,
    @CurrentUser() user: JwtPayload,
  ) {
    const property = await this.getProperty.execute(id);
    this.ownershipPolicy.assertCanManage(user, property);

    const updated = await this.changeStatus.execute(id, dto.status);

    return PropertySerializer.serialize(updated);
  }

  @Delete(':id')
  @Auth(Permission.PROPERTY_DELETE)
  @ApiOperation({ summary: 'Delete property' })
  async delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    const property = await this.getProperty.execute(id);
    this.ownershipPolicy.assertCanManage(user, property);

    await this.deleteProperty.execute(id);

    return {
      success: true,
    };
  }
}
