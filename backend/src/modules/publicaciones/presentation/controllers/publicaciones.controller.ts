// backend\src\modules\publicaciones\presentation\controllers\publicaciones.controller.ts

import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';

import {
  ApiBody,
  ApiConsumes,
  ApiTags,
  ApiBearerAuth,
} from '@nestjs/swagger';

import { FilesInterceptor } from '@nestjs/platform-express';

import { CreatePublicacionDto } from '@modules/publicaciones/application/dto/create-publicacion.dto';

import { CreatePublicacionUseCase } from '@modules/publicaciones/application/use-cases/create-publicacion.usecase';

import { CurrentUser } from '@/shared/security/decorators/current-user.decorator';
import { Auth } from '@/shared/security/decorators/auth.decorator';

import { JwtPayload } from '@modules/auth/application/contracts/jwt-payload.contracts';

@ApiTags('Publicaciones')
@ApiBearerAuth('access-token')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly createPublicacionUseCase: CreatePublicacionUseCase,
  ) {}

  @Auth()
  @Post()
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FilesInterceptor('files', 20))
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        titulo: { type: 'string' },
        descripcion: { type: 'string' },
        precio: { type: 'number' },
        direccion: { type: 'string' },
        tipoOperacion: { type: 'string' },
        tipoPropiedad: { type: 'string' },
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  async create(
    @Body() dto: CreatePublicacionDto,
    @UploadedFiles() files: Express.Multer.File[],
    @CurrentUser() user: JwtPayload,
  ) {
    return this.createPublicacionUseCase.execute({
      dto,
      files,
      userId: user.sub,
    });
  }
}