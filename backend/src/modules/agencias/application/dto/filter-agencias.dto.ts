// backend\src\modules\agencias\application\dto\filter-agencias.dto.ts
import {
  IsBooleanString,
  IsOptional,
  IsString,
} from 'class-validator';

export class FilterAgenciasDto {
  @IsOptional()
  @IsString()
  nombre?: string;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsBooleanString()
  activa?: string;

  @IsOptional()
  page?: string;

  @IsOptional()
  limit?: string;
}