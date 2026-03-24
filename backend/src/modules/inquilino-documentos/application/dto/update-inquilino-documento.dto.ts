// backend\src\modules\inquilino-documentos\application\dto\update-inquilino-documento.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentoEstado } from '@shared/contracts';

export class UpdateInquilinoDocumentoDto {
@IsEnum(DocumentoEstado)
estado: DocumentoEstado;

  @IsOptional()
  @IsString()
  comentarioRechazo?: string;
}
