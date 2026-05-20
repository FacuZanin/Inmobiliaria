// backend\src\modules\publicaciones\application\dto\create-publicacion-multipart.dto.ts
import { ApiProperty }
  from '@nestjs/swagger';

import {
  IsArray,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

import { Type }
  from 'class-transformer';

import { OperacionTipo }
  from '@shared/contracts/enums/operacion-tipo.enum';

import { PropiedadTipo }
  from '@shared/contracts/enums/propiedad-tipo.enum';

export class CreatePublicacionMultipartDto {
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

  @ApiProperty({
    enum: OperacionTipo,
  })
  @IsEnum(OperacionTipo)
  tipoOperacion!: OperacionTipo;

  @ApiProperty({
    enum: PropiedadTipo,
  })
  @IsEnum(PropiedadTipo)
  tipoPropiedad!: PropiedadTipo;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  latitud?: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  longitud?: number;

  @ApiProperty({
    type: 'array',

    items: {
      type: 'string',
      format: 'binary',
    },
  })
  @IsOptional()
  @IsArray()
  files?: any[];
}