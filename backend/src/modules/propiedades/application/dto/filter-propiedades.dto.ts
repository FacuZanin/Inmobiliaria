// backend\src\modules\propiedades\application\dto\filter-propiedades.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { PropiedadTipo, OperacionTipo } from '@shared/contracts';

export class FilterPropiedadesDto {
  @IsOptional()
  @IsEnum(PropiedadTipo)
  tipo?: PropiedadTipo;

  @IsOptional()
  @IsEnum(OperacionTipo)
  operacion?: OperacionTipo;

  @IsOptional()
  localidad?: string;

  @IsOptional()
  precioMin?: number;

  @IsOptional()
  precioMax?: number;
}
