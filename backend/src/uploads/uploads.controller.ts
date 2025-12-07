import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadsService } from './uploads.service';
import { Auth } from '../common/decorators/auth.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@Controller('uploads')
@Auth(UserRole.ADMIN, UserRole.AGENCIA, UserRole.EMPLEADO)
export class UploadsController {
  constructor(private uploadsService: UploadsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('No se proporcionó archivo');
    }

    const filepath = await this.uploadsService.saveFile(file);

    return {
      message: 'Archivo subido correctamente',
      filepath,
      filename: file.originalname,
    };
  }
}
