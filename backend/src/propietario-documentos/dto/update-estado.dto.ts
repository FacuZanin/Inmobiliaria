import { IsEnum, IsOptional, IsString } from 'class-validator';
import { DocumentoEstado } from '../../common/enums/documento-estado.enum';


export class UpdateEstadoDocumentoDto {
  @IsEnum(DocumentoEstado)
  estado: DocumentoEstado;

  @IsOptional()
  @IsString()
  comentarioRechazo?: string;
}
