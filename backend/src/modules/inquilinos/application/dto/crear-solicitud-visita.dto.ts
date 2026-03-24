// backend\src\modules\inquilinos\application\dto\crear-solicitud-visita.dto.ts
import { IsInt, IsString, IsDateString } from 'class-validator';

export class CrearSolicitudVisitaDTO {
  @IsInt()
  propiedadId: number;

  @IsString()
  mensaje: string;

  @IsDateString()
  fechaDeseada: string;
}
