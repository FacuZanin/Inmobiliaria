// backend/src/modules/inquilino-documentos/application/dto/create-inquilino-documento.dto.ts
import { IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TipoDocumentoInquilino } from '@shared/contracts/enums/tipo-documento-inquilino.enum';


export class CreateInquilinoDocumentoDto {
  @ApiProperty({
    enum: TipoDocumentoInquilino,
    example: TipoDocumentoInquilino.DNI,
    description: 'Tipo de documento del inquilino a subir',
  })
  @IsEnum(TipoDocumentoInquilino)
  tipoDocumento: TipoDocumentoInquilino;
}
