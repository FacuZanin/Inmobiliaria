// backend/src/modules/publicaciones/application/commands/create-publicacion.command.ts

import { CreatePublicacionDto } from '../dto/create-publicacion.dto';

export interface CreatePublicacionCommand {
  dto: CreatePublicacionDto;
  files: Express.Multer.File[];
  userId: string;
}