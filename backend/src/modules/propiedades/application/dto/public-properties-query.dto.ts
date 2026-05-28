// backend\src\modules\propiedades\application\dto\public-properties-query.dto.ts
// backend/src/modules/propiedades/application/dto/public-properties-query.dto.ts

import { ApiPropertyOptional } from '@nestjs/swagger';

import { Type } from 'class-transformer';

import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

import { PaginationQueryDto } from '@/shared/application/dto/pagination-query.dto';

import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { OrderEnum } from '@shared/contracts/enums/order.enum';

export class PublicPropertiesQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    enum: PropiedadTipo,
  })
  @IsOptional()
  @IsEnum(PropiedadTipo)
  tipo?: PropiedadTipo;

  @ApiPropertyOptional({
    enum: OperacionTipo,
  })
  @IsOptional()
  @IsEnum(OperacionTipo)
  operacion?: OperacionTipo;

  @ApiPropertyOptional({
    example: 'Palermo',
  })
  @IsOptional()
  @IsString()
  localidad?: string;

  @ApiPropertyOptional({
    example: 100000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioMin?: number;

  @ApiPropertyOptional({
    example: 500000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioMax?: number;

  @ApiPropertyOptional({
    example: 3,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ambientes?: number;

  @ApiPropertyOptional({
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dormitorios?: number;

  @ApiPropertyOptional({
    example: 2,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  banos?: number;

  @ApiPropertyOptional({
    example: 'departamento con balcón',
  })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    example: 5,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  agencyId?: number;

  @ApiPropertyOptional({
    enum: OrderEnum,
    example: OrderEnum.DESC,
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  order?: OrderEnum = OrderEnum.DESC;
}