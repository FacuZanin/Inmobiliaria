// backend\src\modules\publicaciones\application\use-cases\observe-publicacion.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { PublicacionRepository }
  from '../../domain/repositories/publicacion.repository';

@Injectable()
export class ObservePublicacionUseCase {
  constructor(
    @Inject(PublicacionRepository)
    private readonly publicacionRepository:
      PublicacionRepository,
  ) {}

  async execute(
    id: number,
    reason?: string,
  ) {
    const publicacion =
      await this.publicacionRepository.findById(id);

    if (!publicacion) {
      throw new NotFoundException(
        'Publicación no encontrada',
      );
    }

    publicacion.observe(reason);

    return this.publicacionRepository.save(
      publicacion,
    );
  }
}