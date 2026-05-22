// backend\src\modules\inquilino-documentos\infrastructure\controllers\inquilino-documentos.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';

import { CreateInquilinoDocumentoDto } from '../../application/dto/create-inquilino-documento.dto';

import { SubirDocumentoInquilinoUseCase } from '../../application/use-cases/subir-documento.usecase';
import { CambiarEstadoInquilinoDocumentoUseCase } from '../../application/use-cases/cambiar-estado.usecase';
import { ListarMisDocumentosUseCase } from '../../application/use-cases/listar-mis-documentos.usecase';

import {User} from '@modules/user/domain/entities/user.entity'

@ApiTags('Inquilino Documentos')
@Controller('inquilino-documentos')
export class InquilinoDocumentosController {
  constructor(
    private readonly subirDocumento: SubirDocumentoInquilinoUseCase,
    private readonly cambiarEstado: CambiarEstadoInquilinoDocumentoUseCase,
    private readonly listarMisDocs: ListarMisDocumentosUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  @Auth(Permission.DOCUMENT_UPLOAD)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Subir documento de inquilino',
    description:
      'Recibe multipart/form-data con tipoDocumento y el archivo en el campo archivo.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['tipoDocumento', 'archivo'],
      properties: {
        tipoDocumento: {
          type: 'string',
          enum: ['DNI', 'RECIBO_SUELDO', 'GARANTIA'],
        },
        archivo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: CreateInquilinoDocumentoDto,
    @CurrentUser() user: User,
  ) {
    return this.subirDocumento.execute(dto, archivo, user);
  }
}
