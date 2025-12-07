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

import { PropietarioDocumentosService } from './propietario-documentos.service';
import { CreateDocumentoDto } from './dto/create-documento.dto';
import { UpdateEstadoDocumentoDto } from './dto/update-estado.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/user.entity/user.entity';

@Controller('propietario-documentos')
export class PropietarioDocumentosController {
  constructor(private readonly documentosService: PropietarioDocumentosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  @Auth(UserRole.PROPIETARIO, UserRole.ADMIN)
  subirDoc(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: CreateDocumentoDto,
    @CurrentUser() user: User,
  ) {
    return this.documentosService.subirDocumento(dto, archivo, user);
  }

  @Patch(':id/estado')
  @Auth(UserRole.ADMIN, UserRole.AGENCIA)
  cambiarEstado(@Param('id') id: string, @Body() dto: UpdateEstadoDocumentoDto) {
    return this.documentosService.cambiarEstado(Number(id), dto);
  }
}
