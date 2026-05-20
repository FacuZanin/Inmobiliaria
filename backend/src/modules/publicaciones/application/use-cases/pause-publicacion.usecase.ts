// backend\src\modules\publicaciones\application\use-cases\pause-publicacion.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { PublicacionRepository }
  from '../../domain/repositories/publicacion.repository';

@Injectable()
export class PausePublicacionUseCase {
  constructor(
    @Inject(PublicacionRepository)
    private readonly publicacionRepository:
      PublicacionRepository,
  ) {}

  async execute(id: number) {
    const publicacion =
      await this.publicacionRepository.findById(id);

    if (!publicacion) {
      throw new NotFoundException(
        'Publicación no encontrada',
      );
    }

    publicacion.pause();

    return this.publicacionRepository.save(
      publicacion,
    );
  }
}