// backend/src/modules/favoritos/application/use-cases/get-my-favorites.usecase.
import { Injectable } from '@nestjs/common';

import { FavoriteRepositoryPort } from '../ports/favorite-repository.port';

@Injectable()
export class GetMyFavoritesUseCase {
  constructor(
    private readonly favoriteRepository: FavoriteRepositoryPort,
  ) {}

  async execute(userId: number) {
    return this.favoriteRepository.getUserFavorites(
      userId,
    );
  }
}