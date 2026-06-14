import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { Auth } from '@/security/decorators/auth.decorator';
import { ChangePropertyStatusDto } from '@/modules/properties/application/dto/change-property-status.dto';
import { SearchPropertiesDto } from '@/modules/properties/application/dto/search-properties.dto';
import { ChangePropertyStatusUseCase } from '@/modules/properties/application/use-cases/change-property-status.usecase';
import { GetPropertyUseCase } from '@/modules/properties/application/use-cases/get-property.usecase';
import { SearchPropertiesUseCase } from '@/modules/properties/application/use-cases/search-properties.usecase';
import { PropertySerializer } from '../serializers/property.serializer';

@ApiTags('Admin Properties')
@Controller('admin/properties')
@Auth(Permission.PROPERTY_READ_PRIVATE)
export class PropertyAdminController {
  constructor(
    private readonly getProperty: GetPropertyUseCase,
    private readonly searchProperties: SearchPropertiesUseCase,
    private readonly changeStatus: ChangePropertyStatusUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search properties as admin' })
  async search(@Query() filters: SearchPropertiesDto) {
    const result = await this.searchProperties.execute(filters);

    return PropertySerializer.serializePaginated(result);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property as admin' })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const property = await this.getProperty.execute(id);

    return PropertySerializer.serialize(property);
  }

  @Patch(':id/status')
  @Auth(Permission.PROPERTY_UPDATE)
  @ApiOperation({ summary: 'Change property status as admin' })
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ChangePropertyStatusDto,
  ) {
    const property = await this.changeStatus.execute(id, dto.status);

    return PropertySerializer.serialize(property);
  }
}
