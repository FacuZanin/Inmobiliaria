// backend\src\modules\inquilinos\application\dto\actualizar-perfil.dto.ts
import { IsOptional, IsString, IsBoolean, IsInt, IsArray } from 'class-validator';

export class ActualizarPerfilDTO {
  @IsOptional()
  @IsString()
  telefonoAlternativo?: string;

  @IsOptional()
  @IsInt()
  ingresosMensuales?: number;

  @IsOptional()
  @IsInt()
  antiguedadLaboralMeses?: number;

  @IsOptional()
  @IsBoolean()
  tieneGarante?: boolean;

  @IsOptional()
  @IsBoolean()
  tieneMascota?: boolean;

  @IsOptional()
  @IsString()
  operacionBuscada?: 'ALQUILER' | 'COMPRA';

  @IsOptional()
  @IsInt()
  presupuestoMaximo?: number;

  @IsOptional()
  @IsArray()
  zonasPreferidas?: string[];
}
