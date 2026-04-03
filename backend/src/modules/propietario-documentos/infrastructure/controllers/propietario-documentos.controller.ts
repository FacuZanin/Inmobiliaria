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

import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { UserProfile } from '@shared/enums/user-profile.enum';
import { Profiles } from '../../../../shared/security/decorators/profiles.decorator';
import { CurrentUser } from '../../../../shared/security/decorators/current-user.decorator';
import { User } from '../../../../modules/user/domain/entities/user.entity';

@Controller('propietario-documentos')
export class PropietarioDocumentosController {
  constructor(
    private readonly subirDocumento: SubirDocumentoPropietarioUseCase,
    private readonly cambiarEstado: CambiarEstadoDocumentoPropietarioUseCase,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  @Auth()
  @Profiles(UserProfile.PROPIETARIO)
  subirDoc(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: CreateDocumentoDto,
    @CurrentUser() user: User,
  ) {
    return this.subirDocumento.execute(dto, archivo, user);
  }

  @Patch(':id/estado')
  @Auth()
  @Profiles(UserProfile.AGENCIA)
  cambiar(@Param('id') id: string, @Body() dto: UpdateEstadoDocumentoDto) {
    return this.cambiarEstado.execute(Number(id), dto);
  }
}
