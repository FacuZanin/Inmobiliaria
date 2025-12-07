import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  IsString,
  IsArray,
  ValidateNested,
  IsObject
} from 'class-validator';

import { TipoPropiedad } from '../../common/enums/propiedad-tipo.enum';
import { TipoOperacion } from '../../common/enums/operacion-tipo.enum';
import { IsPositiveInteger } from '../../common/validators/is-positive-integer.validator';
import { Type } from 'class-transformer';

export class CreatePropiedadDto {
  @IsNotEmpty()
  @IsString()
  titulo: string;

  @IsOptional()
  @IsString()
  descripcion?: string;

  @IsEnum(TipoPropiedad)
  tipo: TipoPropiedad;

  @IsEnum(TipoOperacion)
  operacion: TipoOperacion;

  @IsOptional()
  @IsNumber()
  precioVenta?: number;

  @IsOptional()
  @IsNumber()
  precioAlquiler?: number;

  @IsNotEmpty()
  @IsString()
  direccion: string;

  @IsNotEmpty()
  @IsString()
  localidad: string;

  @IsOptional()
  @IsNumber()
  ambientes?: number;

  @IsOptional()
  @IsNumber()
  dormitorios?: number;

  @IsOptional()
  @IsNumber()
  banos?: number;

  @IsOptional()
  @IsNumber()
  metrosCubiertos?: number;

  @IsOptional()
  @IsNumber()
  metrosTotales?: number;

  @IsOptional()
  @IsPositiveInteger()
  propietarioId?: number;

  @IsOptional()
  @IsPositiveInteger()
  agenciaId?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  imagenes?: string[];

@IsOptional()
detalles?: Record<string, any>;

  
  
}
