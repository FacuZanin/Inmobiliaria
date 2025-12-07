import {
  Controller,
  Post,
  Patch,
  Body,
  Param,
  UseInterceptors,
  UploadedFile,
  Get,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { InquilinoDocumentosService } from './inquilino-documentos.service';
import { CreateInquilinoDocumentoDto } from './dto/create-inquilino-documento.dto';
import { UpdateInquilinoDocumentoDto } from './dto/update-inquilino-documento.dto';

import { Auth } from '../common/decorators/auth.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { User } from '../users/user.entity/user.entity';

@Controller('inquilino-documentos')
export class InquilinoDocumentosController {
  constructor(private readonly service: InquilinoDocumentosService) {}

  @Post()
  @UseInterceptors(FileInterceptor('archivo'))
  @Auth(UserRole.INQUILINO)
  subir(
    @UploadedFile() archivo: Express.Multer.File,
    @Body() dto: CreateInquilinoDocumentoDto,
    @CurrentUser() user: User,
  ) {
    return this.service.subirDocumento(dto, archivo, user);
  }

  @Patch(':id/estado')
  @Auth(UserRole.ADMIN, UserRole.AGENCIA)
  cambiarEstado(
    @Param('id') id: string,
    @Body() dto: UpdateInquilinoDocumentoDto,
  ) {
    return this.service.cambiarEstado(Number(id), dto);
  }

  @Get('mios')
  @Auth(UserRole.INQUILINO)
  listarMisDocs(@CurrentUser() user: User) {
    return this.service.listarParaInquilino(user);
  }
}
