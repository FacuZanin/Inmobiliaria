import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CrearSolicitudAgenciaDto {
  @IsNotEmpty()
  @IsString()
  nombre!: string;

  @IsNotEmpty()
  @IsNumber()
  userId!: number;
}