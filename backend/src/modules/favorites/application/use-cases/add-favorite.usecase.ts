// backend/src/modules/favoritos/application/use-cases/add-favorite.usecase.ts
import { Injectable } from '@nestjs/common';

import { FavoriteRepositoryPort } from '../ports/favorite-repository.port';

@Injectable()
export class AddFavoriteUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepositoryPort,
  ) {}

  async execute(userId: number, propertyId: number) {
    return this.favoriteRepository.addFavorite(
      userId,
      propertyId,
    );
  }
}