import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentoEstado } from '../../common/enums/documento-estado.enum';

export class CambiarEstadoDto {
  @IsEnum(DocumentoEstado)
  estado: DocumentoEstado;

  @IsOptional()
  @IsString()
  comentarioRechazo?: string;
}
