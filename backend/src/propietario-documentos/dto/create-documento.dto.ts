import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { TipoDocumentoPropietario } from '../entities/propietario-documento.entity';

export class CreateDocumentoDto {
  @IsEnum(TipoDocumentoPropietario)
  tipoDocumento: TipoDocumentoPropietario;

  @IsInt()
  propietarioId: number;

  @IsOptional()
  @IsInt()
  propiedadId?: number;
}
