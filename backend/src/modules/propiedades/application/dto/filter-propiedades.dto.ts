// backend\src\modules\propiedades\application\dto\filter-propiedades.dto.ts
import { IsEnum, IsOptional } from 'class-validator';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

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
