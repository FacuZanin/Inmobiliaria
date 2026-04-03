// backend\src\modules\operaciones\application\dto\filter-operaciones.dto.ts
import { IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { OperacionTipo } from '@shared/enums/operacion-tipo.enum';
import { OperacionEstado } from '@shared/enums/operacion-estado.enum';

export class FilterOperacionesDto {
  @IsEnum(OperacionTipo)
  @IsOptional()
  tipo?: OperacionTipo;

  @IsEnum(OperacionEstado)
  @IsOptional()
  estado?: OperacionEstado;

  @IsDateString()
  @IsOptional()
  fechaDesde?: string;

  @IsDateString()
  @IsOptional()
  fechaHasta?: string;

  @IsInt()
  @IsOptional()
  propiedadId?: number;
}
