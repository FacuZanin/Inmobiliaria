// backend/src/modules/inquilino-documentos/application/dto/create-inquilino-documento.dto.ts
import { IsEnum } from 'class-validator';
import { TipoDocumentoInquilino } from '../../domain/entities/inquilino-documento.entity';


export class CreateInquilinoDocumentoDto {
  @IsEnum(TipoDocumentoInquilino)
  tipoDocumento: TipoDocumentoInquilino;
}
