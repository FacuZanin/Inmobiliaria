// backend\src\modules\publicaciones\application\dto\create-publicacion.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
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

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  escritura!: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  dniFrente!: any;

  @ApiProperty({
    type: 'string',
    format: 'binary',
  })
  dniDorso!: any;
}