// backend/src/modules/publicaciones/application/dto/create-publicacion.dto.ts

import { ApiProperty } from '@nestjs/swagger';

import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsBooleanString,
  IsNumberString,
  IsEnum,
} from 'class-validator';

import { Type } from 'class-transformer';

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
  @IsString()
  nombre!: string;

  @ApiProperty()
  @IsString()
  telefono!: string;

  @ApiProperty()
  @IsString()
  email!: string;
}

export class CreatePublicacionDto {
  // ---------------------------------------------------
  // BASICO
  // ---------------------------------------------------

  @ApiProperty()
  @IsString()
  titulo!: string;

  @ApiProperty()
  @IsString()
  descripcion!: string;

  @ApiProperty()
  @IsNumberString()
  precio!: string;

  // ---------------------------------------------------
  // UBICACION
  // ---------------------------------------------------

  @ApiProperty()
  @IsString()
  direccion!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  latitud?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  longitud?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  localidad?: string;

  // ---------------------------------------------------
  // PROPERTY
  // ---------------------------------------------------

  @ApiProperty({
    enum: TipoOperacionDto,
  })
  @IsEnum(TipoOperacionDto)
  tipoOperacion!: TipoOperacionDto;

  @ApiProperty({
    enum: TipoPropiedadDto,
  })
  @IsEnum(TipoPropiedadDto)
  tipoPropiedad!: TipoPropiedadDto;

  // ---------------------------------------------------
  // FEATURES
  // ---------------------------------------------------

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  ambientes?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  banos?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  dormitorios?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  superficieTotal?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumberString()
  superficieCubierta?: string;

  // ---------------------------------------------------
  // AMENITIES
  // ---------------------------------------------------

  @ApiProperty({
    type: [String],
    required: false,
  })
  @IsOptional()
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
