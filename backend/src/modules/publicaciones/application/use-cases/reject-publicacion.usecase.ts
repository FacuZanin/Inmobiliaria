// backend\src\modules\publicaciones\application\use-cases\reject-publicacion.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { PublicacionRepository }
  from '../../domain/repositories/publicacion.repository';

@Injectable()
export class RejectPublicacionUseCase {
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

    publicacion.reject(reason);

    return this.publicacionRepository.save(
      publicacion,
    );
  }
}