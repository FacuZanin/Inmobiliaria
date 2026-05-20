// backend/src/modules/publicaciones/application/dto/create-publicacion.dto.ts

import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsLatitude,
  IsLongitude,
} from 'class-validator';

export class CreatePublicacionDto {
  @ApiProperty()
  @IsString()
  titulo!: string;

  @ApiProperty()
  @IsString()
  descripcion!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  precio!: number;

  @ApiProperty()
  @IsString()
  direccion!: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsLatitude()
  latitud?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @Type(() => Number)
  @IsLongitude()
  longitud?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tipoOperacion?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tipoPropiedad?: string;
}