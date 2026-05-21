// backend\src\modules\admin-publicaciones\application\use-cases\admin-list-publicaciones.usecase.ts
import { Injectable, Inject } from '@nestjs/common';

import { PublicacionRepository } from '@/modules/publicaciones/domain/repositories/publicacion.repository';

import { FilterPublicacionesDto } from '@modules/admin-publicaciones/application/dto/filter-publicaciones.dto';

@Injectable()
export class AdminListPublicacionesUseCase {
  constructor(
    @Inject(PublicacionRepository)
    private readonly publicacionRepository: PublicacionRepository,
  ) {}

  async execute(filters: FilterPublicacionesDto) {
    return this.publicacionRepository.findAll(filters);
  }
}