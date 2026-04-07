// backend/src/modules/inquilino-documentos/application/dto/create-inquilino-documento.dto.ts
import { IsEnum } from 'class-validator';
import { TipoDocumentoInquilino } from '@shared/contracts/enums/tipo-documento-inquilino.enum';


export class CreateInquilinoDocumentoDto {
  @IsEnum(TipoDocumentoInquilino)
  tipoDocumento: TipoDocumentoInquilino;
}
