// backend\src\modules\propietario-documentos\application\dto\create-documento.dto.ts
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TipoDocumentoPropietario } from '../../domain/entities/propietario-documento.domain';

export class CreateDocumentoDto {
  @IsEnum(TipoDocumentoPropietario)
  tipoDocumento: TipoDocumentoPropietario;

  @IsInt()
  propietarioId: number;

  @IsOptional()
  @IsInt()
  propiedadId?: number;
}
