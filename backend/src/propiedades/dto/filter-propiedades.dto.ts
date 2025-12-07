import { IsEnum, IsOptional } from 'class-validator';
import { TipoPropiedad } from '../../common/enums/propiedad-tipo.enum';
import { TipoOperacion } from '../../common/enums/operacion-tipo.enum';

export class FilterPropiedadesDto {
  @IsOptional()
  @IsEnum(TipoPropiedad)
  tipo?: TipoPropiedad;

  @IsOptional()
  @IsEnum(TipoOperacion)
  operacion?: TipoOperacion;

  @IsOptional()
  localidad?: string;

  @IsOptional()
  precioMin?: number;

  @IsOptional()
  precioMax?: number;
}
