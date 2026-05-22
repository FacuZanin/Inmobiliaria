// backend/src/modules/publicaciones/application/dto/create-publicacion.dto.ts

import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBooleanString,
  IsNumber,
  IsEnum,
} from 'class-validator';

import { Type, Transform } from 'class-transformer';

import {
  capitalizeTransform,
  uppercaseTransform,
  lowercaseTransform,
} from '@/shared/utils/transformers/string.transformers';

export enum TipoOperacionDto {
  VENTA = 'VENTA',
  ALQUILER = 'ALQUILER',
}

export enum TipoPropiedadDto {
  CASA = 'CASA',
  DEPARTAMENTO = 'DEPARTAMENTO',
  LOTE = 'LOTE',
  LOCAL = 'LOCAL',
  OFICINA = 'OFICINA',
  CAMPO = 'CAMPO',
  PH = 'PH',
  POZO = 'POZO',
}

export class PropietarioDto {
  @ApiProperty()
  @Transform(capitalizeTransform)
  @IsString()
  nombre!: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  telefono!: string;

  @ApiProperty()
  @Transform(lowercaseTransform)
  @IsString()
  email!: string;
}

export class CreatePublicacionDto {
  // ---------------------------------------------------
  // BASICO
  // ---------------------------------------------------

  @ApiProperty()
  @Transform(capitalizeTransform)
  @IsString()
  titulo!: string;

  @ApiProperty()
  @Transform(({ value }) => value?.trim())
  @IsString()
  descripcion!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  precio!: number;

  // ---------------------------------------------------
  // UBICACION
  // ---------------------------------------------------

  @ApiProperty()
  @Transform(capitalizeTransform)
  @IsString()
  direccion!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  latitud?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => value?.trim())
  @IsString()
  longitud?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(capitalizeTransform)
  @IsString()
  localidad?: string;

  // ---------------------------------------------------
  // PROPERTY
  // ---------------------------------------------------

  @ApiProperty({
    enum: TipoOperacionDto,
  })
  @Transform(uppercaseTransform)
  @IsEnum(TipoOperacionDto)
  tipoOperacion!: TipoOperacionDto;

  @ApiProperty({
    enum: TipoPropiedadDto,
  })
  @Transform(uppercaseTransform)
  @IsEnum(TipoPropiedadDto)
  tipoPropiedad!: TipoPropiedadDto;

  // ---------------------------------------------------
  // FEATURES
  // ---------------------------------------------------

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  ambientes?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  banos?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  dormitorios?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  superficieTotal?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  superficieCubierta?: number;

  // ---------------------------------------------------
  // AMENITIES
  // ---------------------------------------------------

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
  @Transform(({ value }) =>
    Array.isArray(value)
      ? value.map((item) =>
          capitalizeTransform({ value: item } as any),
        )
      : value,
  )
  @IsArray()
  amenities?: string[];

  // ---------------------------------------------------
  // PROPIETARIO
  // ---------------------------------------------------

  @ApiProperty({
    type: PropietarioDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => PropietarioDto)
  propietario?: PropietarioDto;

  // ---------------------------------------------------
  // PRIVACIDAD
  // ---------------------------------------------------

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBooleanString()
  mostrarTelefono?: string;
}