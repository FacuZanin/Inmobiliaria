// backend\src\modules\publicaciones\application\use-cases\approve-publicacion.usecase.ts
import {
  Injectable,
  Inject,
  NotFoundException,
} from '@nestjs/common';

import { PublicacionRepository }
  from '@modules/publicaciones/domain/repositories/publicacion.repository';

@Injectable()
export class ApprovePublicacionUseCase {
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

    publicacion.approve();

    return this.publicacionRepository.save(
      publicacion,
    );
  }
}