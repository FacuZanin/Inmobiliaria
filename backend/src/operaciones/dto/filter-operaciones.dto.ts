import { IsEnum, IsOptional, IsDateString, IsInt } from 'class-validator';
import { TipoOperacion } from '../../common/enums/operacion-tipo.enum';
import { OperacionEstado } from '../../common/enums/operacion-estado.enum';

export class FilterOperacionesDto {
  @IsEnum(TipoOperacion)
  @IsOptional()
  tipo?: TipoOperacion;

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
