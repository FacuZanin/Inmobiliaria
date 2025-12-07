import { IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class DetalleCasaDto {
  @IsOptional() @IsNumber() antiguedad?: number;
  @IsOptional() @IsBoolean() garage?: boolean;
  @IsOptional() @IsBoolean() patio?: boolean;
  @IsOptional() @IsBoolean() quincho?: boolean;
  @IsOptional() @IsBoolean() pileta?: boolean;
  @IsOptional() @IsNumber() superficieTerreno?: number;
  @IsOptional() @IsNumber() superficieConstruida?: number;
}
