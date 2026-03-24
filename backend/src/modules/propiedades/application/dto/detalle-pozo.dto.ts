// backend\src\modules\propiedades\application\dto\detalle-pozo.dto.ts
import { IsOptional, IsNumber, IsString } from 'class-validator';

export class DetallePozoDto {
  @IsOptional() @IsNumber() superficieTotal?: number;
  @IsOptional() @IsString() zonificacion?: string;
  @IsOptional() @IsNumber() frente?: number;
  @IsOptional() @IsNumber() fondo?: number;
}
