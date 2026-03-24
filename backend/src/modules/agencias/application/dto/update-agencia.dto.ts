// backend\src\modules\agencias\application\dto\update-agencia.dto.ts
import { PartialType } from '@nestjs/mapped-types';
import { CreateAgenciaDto } from './create-agencia.dto';

export class UpdateAgenciaDto extends PartialType(CreateAgenciaDto) {}
