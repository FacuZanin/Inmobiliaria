// backend\src\modules\operaciones\application\dto\update-operacion.dto.ts
import { PartialType } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, IsDateString } from 'class-validator';
import { CreateOperacionDto } from './create-operacion.dto';
import { OperacionEstado } from '@shared/contracts';


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
