// backend/src/modules/publicaciones/infrastructure/controllers/publicaciones.controller.ts

import {
  UseGuards,
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

import { CreatePublicacionDto } from '../../application/dto/create-publicacion.dto';

import { CreatePublicacionUseCase } from '../../use-cases/create-publicacion.usecase';

import { JwtAuthGuard } from '@/modules/auth/infrastructure/guards/jwt-auth.guard';

import { CurrentUser } from '@/shared/security/decorators/current-user.decorator';

@ApiTags('Publicaciones')
@ApiBearerAuth('access-token')
@Controller('publicaciones')
export class PublicacionesController {
  constructor(
    private readonly createPublicacionUseCase: CreatePublicacionUseCase,
  ) {}

  @UseGuards(JwtAuthGuard)
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
    @CurrentUser() user: any,
  ) {
    return this.createPublicacionUseCase.execute({
      dto,
      files,
      userId: user.sub,
    });
  }
}