// backend\src\modules\propietario-documentos\application\dto\create-documento.dto.ts
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TipoDocumentoPropietario } from '@shared/enums/tipo-documento-propietario.enum';

export class CreateDocumentoDto {
  @IsEnum(TipoDocumentoPropietario)
  tipoDocumento: TipoDocumentoPropietario;

  @IsInt()
  propietarioId: number;

  @IsOptional()
  @IsInt()
  propiedadId?: number;
}
