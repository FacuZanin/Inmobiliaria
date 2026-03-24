// backend\src\modules\propiedades\application\dto\detalle-campo.dto.ts
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class DetalleCampoDto {
  @IsOptional() @IsNumber() superficieTotal?: number;
  @IsOptional() @IsString() zonificacion?: string;
  @IsOptional() @IsNumber() frente?: number;
  @IsOptional() @IsNumber() fondo?: number;
}
