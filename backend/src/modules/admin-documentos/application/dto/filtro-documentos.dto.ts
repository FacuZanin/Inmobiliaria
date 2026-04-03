// backend\src\modules\admin-documentos\application\dto\filtro-documentos.dto.ts
import { IsOptional, IsEnum, IsString, IsInt } from 'class-validator';
import { DocumentoEstado } from '@shared/enums/documento-estado.enum';

export class FiltroDocumentosDto {
  @IsOptional()
  @IsEnum(['INQUILINO', 'PROPIETARIO'], { each: false })
  documentoTipo?: 'INQUILINO' | 'PROPIETARIO';

  @IsOptional()
  @IsEnum(DocumentoEstado)
  estado?: DocumentoEstado;

  @IsOptional()
  @IsString()
  tipoDocumento?: string;

  @IsOptional()
  @IsInt()
  propiedadId?: number;

  @IsOptional()
  @IsString()
  propiedadTipo?: string;

  @IsOptional()
  @IsString()
  localidad?: string;

  @IsOptional()
  @IsString()
  usuarioBusqueda?: string;

  @IsOptional()
  @IsInt()
  page?: number;

  @IsOptional()
  @IsInt()
  limit?: number;
}
