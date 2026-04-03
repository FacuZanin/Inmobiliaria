// backend\src\modules\operaciones\application\dto\create-operacion.dto.ts
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsString,
} from 'class-validator';

import { OperacionTipo } from '@shared/enums/operacion-tipo.enum';
import { MedioOperacion } from '@shared/enums/medio-operacion.enum';

export class CreateOperacionDto {
  @IsEnum(OperacionTipo)
  tipo: OperacionTipo;

  @IsEnum(MedioOperacion)
  @IsOptional()
  medio?: MedioOperacion;

  @IsInt()
  propiedadId: number;

  @IsInt()
  @IsOptional()
  agenciaId?: number;

  @IsInt()
  @IsOptional()
  propietarioDirectoId?: number;

  @IsInt()
  @IsOptional()
  compradorInquilinoId?: number;

  @IsDateString()
  @IsOptional()
  fechaReserva?: string;

  @IsString()
  @IsOptional()
  observaciones?: string;
}
