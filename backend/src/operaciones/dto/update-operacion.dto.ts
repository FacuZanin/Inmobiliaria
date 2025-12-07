import { PartialType } from '@nestjs/swagger';
import { CreateOperacionDto } from './create-operacion.dto';
import { OperacionEstado } from '../../common/enums/operacion-estado.enum';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';

export class UpdateOperacionDto extends PartialType(CreateOperacionDto) {
  @IsOptional()
  @IsEnum(OperacionEstado)
  estado?: OperacionEstado;

  @IsOptional()
  @IsString()
  observaciones?: string;

  @IsOptional()
  @IsDateString()
  fechaReserva?: string;
}
