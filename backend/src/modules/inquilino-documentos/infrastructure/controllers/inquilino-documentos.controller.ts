// backend\src\modules\inquilino-documentos\infrastructure\controllers\inquilino-documentos.controller.ts
import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { Roles } from '../../../../shared/security/decorators/roles.decorator';
import { Profiles } from '../../../../shared/security/decorators/profiles.decorator';
import { UserRole, UserProfile } from '@shared/contracts';

import { User } from '../../../../modules/user/domain/entities/user.entity';

import { CreateInquilinoDocumentoDto } from '../../application/dto/create-inquilino-documento.dto';

import { SubirDocumentoInquilinoUseCase } from '../../application/use-cases/subir-documento.usecase';
import { CambiarEstadoInquilinoDocumentoUseCase } from '../../application/use-cases/cambiar-estado.usecase';
import { ListarMisDocumentosUseCase } from '../../application/use-cases/listar-mis-documentos.usecase';

@Controller('inquilino-documentos')
export class InquilinoDocumentosController {
  constructor(
    private readonly subirDocumento: SubirDocumentoInquilinoUseCase,
    private readonly cambiarEstado: CambiarEstadoInquilinoDocumentoUseCase,
    private readonly listarMisDocs: ListarMisDocumentosUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  @Roles(UserRole.USER)
  @Profiles(UserProfile.INQUILINO)
  subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: CreateInquilinoDocumentoDto,
    @CurrentUser() user: User,
  ) {
    return this.subirDocumento.execute(dto, archivo, user);
  }
}
