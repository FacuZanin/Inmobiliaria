import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsInt,
  IsDateString,
  IsString,
} from 'class-validator';

import { TipoOperacion } from '../../common/enums/operacion-tipo.enum';
import { MedioOperacion } from '../../common/enums/medio-operacion.enum';

export class CreateOperacionDto {
  @IsEnum(TipoOperacion)
  tipo: TipoOperacion;

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
