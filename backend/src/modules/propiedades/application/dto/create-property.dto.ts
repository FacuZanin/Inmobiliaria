// backend/src/modules/propiedades/application/dto/create-property.dto.ts

import {
  IsString,
  IsOptional,
  IsNumber,
  IsArray,
  IsObject,
  IsEnum,
  IsInt,
  Min,
  IsUrl,
} from 'class-validator';

import { Type } from 'class-transformer';

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

export class CreatePropertyDTO {
  // ------------------------------------------------
  // GENERALES
  // ------------------------------------------------

  @ApiProperty({
    example: 'Casa moderna con pileta',
  })
  @IsString()
  titulo!: string;

  @ApiPropertyOptional({
    example: 'Excelente propiedad ubicada en zona residencial.',
  })
  @IsOptional()
  @IsString()
  descripcion?: string;

  @ApiProperty({
    enum: PropiedadTipo,
    example: PropiedadTipo.CASA,
  })
  @IsEnum(PropiedadTipo)
  tipo!: PropiedadTipo;

  @ApiProperty({
    enum: OperacionTipo,
    example: OperacionTipo.VENTA,
  })
  @IsEnum(OperacionTipo)
  operacion!: OperacionTipo;

  // ------------------------------------------------
  // PRECIOS
  // ------------------------------------------------

  @ApiPropertyOptional({
    example: 150000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioVenta?: number;

  @ApiPropertyOptional({
    example: 350000,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  precioAlquiler?: number;

  // ------------------------------------------------
  // UBICACIÓN
  // ------------------------------------------------

  @ApiPropertyOptional({
    example: 'Av. Corrientes 1234',
  })
  @IsOptional()
  @IsString()
  direccion?: string;

  @ApiPropertyOptional({
    example: 'Palermo',
  })
  @IsOptional()
  @IsString()
  localidad?: string;

  // ------------------------------------------------
  // AMBIENTES
  // ------------------------------------------------

  @ApiPropertyOptional({
    example: 4,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  ambientes?: number;

  @ApiPropertyOptional({
    example: 3,
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

  // ------------------------------------------------
  // SUPERFICIES
  // ------------------------------------------------

  @ApiPropertyOptional({
    example: 120,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  metrosCubiertos?: number;

  @ApiPropertyOptional({
    example: 250,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  metrosTotales?: number;

  // ------------------------------------------------
  // IMÁGENES
  // ------------------------------------------------

  @ApiPropertyOptional({
    type: [String],
    example: ['https://cdn.site.com/1.jpg', 'https://cdn.site.com/2.jpg'],
  })
  @IsOptional()
  @IsArray()
  @IsUrl(
    {},
    {
      each: true,
    },
  )
  imagenes?: string[];

  // ------------------------------------------------
  // RELACIONES
  // ------------------------------------------------

  @ApiPropertyOptional({
    example: 1,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  propietarioId?: number;

  @ApiPropertyOptional({
    example: 1,
    nullable: true,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  agenciaId?: number | null;

  // ------------------------------------------------
  // DETALLES POLIMÓRFICOS
  // ------------------------------------------------

  @ApiPropertyOptional({
    type: Object,
    example: {
      pileta: true,
      garage: true,
      antiguedad: 5,
    },
  })
  @IsOptional()
  @IsObject()
  detalles?: Record<string, any>;

  @ApiPropertyOptional({
    enum: PropertyStatus,
  })
  @IsOptional()
  @IsEnum(PropertyStatus)
  status?: PropertyStatus;
}
