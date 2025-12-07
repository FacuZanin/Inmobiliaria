import { IsOptional, IsBoolean, IsNumber, IsString } from 'class-validator';

export class DetalleDepartamentoDto {
  @IsOptional() @IsNumber() piso?: number;
  @IsOptional() @IsString() unidad?: string;
  @IsOptional() @IsBoolean() ascensor?: boolean;
  @IsOptional() @IsNumber() expensas?: number;
  @IsOptional() @IsNumber() superficieBalcon?: number;
  @IsOptional() @IsBoolean() cochera?: boolean;
}
