// backend\src\modules\propiedades\application\dto\filter-propiedades.dto.ts
import {
  IsEnum,
  IsOptional,
  IsString,
  IsNumber,
  Min,
  IsInt,
  Max,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ApiPropertyOptional } from '@nestjs/swagger';

import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

export class FilterPropiedadesDto {
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

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  localidad?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioMax?: number;

  @ApiPropertyOptional({
    default: 20,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({
    default: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number = 0;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ambientes?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  dormitorios?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  banos?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agenciaId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({
    enum: ['ASC', 'DESC'],
  })
  @IsOptional()
  sort?: 'ASC' | 'DESC' = 'DESC';

  @ApiPropertyOptional({
    enum: PropertyStatus,
  })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
