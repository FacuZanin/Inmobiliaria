import { IsOptional, IsNumber, IsString } from 'class-validator';

export class DetalleLoteDto {
  @IsOptional() @IsNumber() superficieTotal?: number;
  @IsOptional() @IsString() zonificacion?: string;
  @IsOptional() @IsNumber() frente?: number;
  @IsOptional() @IsNumber() fondo?: number;
}
