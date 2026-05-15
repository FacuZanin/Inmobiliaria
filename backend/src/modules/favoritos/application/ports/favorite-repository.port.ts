// backend\src\modules\favoritos\application\dto\ports\favorite-repository.port.ts
import { Favorite } from '../../domain/entities/favorite.entity';

export abstract class FavoriteRepositoryPort {
  abstract addFavorite(
    userId: number,
    propertyId: number,
  ): Promise<Favorite>;

  abstract removeFavorite(
    userId: number,
    propertyId: number,
  ): Promise<void>;

  abstract getUserFavorites(userId: number): Promise<Favorite[]>;

  abstract isFavorite(
    userId: number,
    propertyId: number,
  ): Promise<boolean>;

  abstract countByProperty(propertyId: number): Promise<number>;
}