// backend\src\modules\admin-documentos\application\dto\cambiar-estado.dto.ts
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentoEstado } from '@shared/contracts/enums/documento-estado.enum';

export class CambiarEstadoDto {
  @IsEnum(DocumentoEstado)
  estado: DocumentoEstado;

  @IsOptional()
  @IsString()
  comentarioRechazo?: string;
}
