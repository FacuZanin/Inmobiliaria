// backend\src\modules\uploads\infrastructure\controllers\uploads.controller.ts
import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { Auth } from '../../../../shared/security/decorators/auth.decorator';
import { UserRole } from '@shared/contracts/enums/user-role.enum';

import type { FileStoragePort } from '../../application/ports/file-storage.port';
import { FILE_STORAGE } from '../../application/tokens';

@Controller('uploads')
@Auth(UserRole.SUPERADMIN, UserRole.MODERATOR)
export class UploadsController {
  constructor(
    @Inject(FILE_STORAGE)
    private readonly storage: FileStoragePort,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    const filepath = await this.storage.save(file);

    return {
      message: 'Archivo subido correctamente',
      filepath,
      filename: file.originalname,
    };
  }
}
