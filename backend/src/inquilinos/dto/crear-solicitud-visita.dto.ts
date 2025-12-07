import { IsInt, IsString, IsDateString } from 'class-validator';

export class CrearSolicitudVisitaDto {
  @IsInt()
  propiedadId: number;

  @IsString()
  mensaje: string;

  @IsDateString()
  fechaDeseada: string;
}
