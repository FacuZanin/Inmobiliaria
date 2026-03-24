// backend\src\modules\propietario-documentos\application\dto\update-estado.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentoEstado } from '@shared/contracts';

export class UpdateEstadoDocumentoDto {
  @IsEnum(DocumentoEstado)
  estado: DocumentoEstado;

  @IsOptional()
  @IsString()
  comentarioRechazo?: string;
}
