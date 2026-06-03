// backend\src\modules\propietario-documentos\infrastructure\controllers\propietario-documentos.controller.ts
import {
  Controller,
  Post,
  Patch,
  Param,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { SubirDocumentoPropietarioUseCase } from '../../application/use-cases/subir-documento.usecase';
import { CambiarEstadoDocumentoPropietarioUseCase } from '../../application/use-cases/cambiar-estado.usecase';

import { CreateDocumentoDto } from '../../application/dto/create-documento.dto';
import { UpdateEstadoDocumentoDto } from '../../application/dto/update-estado.dto';

import { Auth } from '../../../../core/shared/security/decorators/auth.decorator';
import { CurrentUser } from '../../../../core/shared/security/decorators/current-user.decorator';
import { UserTypes } from '../../../../core/shared/security/decorators/user-type.decorator';

import { User } from '../../../../users/domain/entities/user.entity';
import { UserType } from '@shared/contracts/enums/user-type.enum';
import { PROPERTY_PUBLISHERS } from '@/modules/users/domain/capabilities/property-publishers';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Propietario Documentos')
@Controller('propietario-documentos')
export class PropietarioDocumentosController {
  constructor(
    private readonly subirDocumento: SubirDocumentoPropietarioUseCase,
    private readonly cambiarEstado: CambiarEstadoDocumentoPropietarioUseCase,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('archivo', {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  @Auth()
  @UserTypes(UserType.PARTICULAR)
  @ApiBearerAuth('access-token')
  @ApiOperation({
    summary: 'Subir documento de propietario',
    description:
      'Recibe multipart/form-data con tipoDocumento, propietarioId, propiedadId opcional y el archivo en el campo archivo.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      required: ['tipoDocumento', 'propietarioId', 'archivo'],
      properties: {
        tipoDocumento: {
          type: 'string',
          enum: ['DNI_FRENTE', 'DNI_DORSO', 'ESCRITURA', 'IMPUESTO'],
        },
        propietarioId: {
          type: 'integer',
          example: 1,
        },
        propiedadId: {
          type: 'integer',
          nullable: true,
          example: 10,
        },
        archivo: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  subirDoc(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: CreateDocumentoDto,
    @CurrentUser() user: User,
  ) {
    return this.subirDocumento.execute(dto, archivo, user);
  }

  @Patch(':id')
  @Auth()
  @UserTypes(...PROPERTY_PUBLISHERS)
  @ApiBearerAuth('access-token')
  cambiar(@Param('id') id: string, @Body() dto: UpdateEstadoDocumentoDto) {
    return this.cambiarEstado.execute(Number(id), dto);
  }
}
