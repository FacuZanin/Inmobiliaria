// backend\src\modules\propiedades\application\dto\base-terreno-detalle.dto.ts
import {
  IsOptional,
  IsNumber,
  IsString,
  Min,
} from 'class-validator';

import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseTerrenoDetalleDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  superficieTotal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  zonificacion?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  frente?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  @Min(0)
  fondo?: number;
}