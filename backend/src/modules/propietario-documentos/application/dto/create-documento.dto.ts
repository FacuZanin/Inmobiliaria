// backend\src\modules\propietario-documentos\application\dto\create-documento.dto.ts
import { IsEnum, IsInt, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoDocumentoPropietario } from '@shared/contracts/enums/tipo-documento-propietario.enum';

export class CreateDocumentoDto {
  @ApiProperty({
    enum: TipoDocumentoPropietario,
    example: TipoDocumentoPropietario.DNI_FRENTE,
    description: 'Tipo de documento del propietario a subir',
  })
  @IsEnum(TipoDocumentoPropietario)
  tipoDocumento: TipoDocumentoPropietario;

  @ApiProperty({
    example: 1,
    description: 'ID del propietario. Debe coincidir con el usuario autenticado.',
  })
  @IsInt()
  propietarioId: number;

  @ApiPropertyOptional({
    example: 10,
    description:
      'ID de la propiedad si el documento ya esta asociado a una propiedad concreta.',
  })
  @IsOptional()
  @IsInt()
  propiedadId?: number;
}
