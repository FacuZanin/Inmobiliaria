// backend/src/inquilino-documentos/dto/create-inquilino-documento.dto.ts
import { IsEnum } from 'class-validator';
import { TipoDocumentoInquilino } from '../entities/inquilino-documento.entity';

export class CreateInquilinoDocumentoDto {
  @IsEnum(TipoDocumentoInquilino)
  tipoDocumento: TipoDocumentoInquilino;
}
