// backend/src/modules/publicaciones/use-cases/create-publicacion.usecase.ts

import { Injectable } from '@nestjs/common';

import { CreatePublicacionCommand } from '../application/commands/create-publicacion.command';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

@Injectable()
export class CreatePublicacionUseCase {
  async execute(command: CreatePublicacionCommand) {
    const { dto, files, userId } = command;

    console.log('CREANDO PUBLICACION');

    console.log({
      dto,
      files: files?.length || 0,
      userId,
    });

    return {
      success: true,
      message: 'Publicación creada correctamente',
      data: {
        ...dto,
        filesUploaded: files?.length || 0,
        ownerId: userId,
        status: PublicacionStatus.EN_REVISION,
        visible: true,
        verified: false,
      },
    };
  }
}