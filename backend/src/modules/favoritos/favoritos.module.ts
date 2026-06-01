// backend/src/modules/favoritos/favoritos.module.ts
import { Module } from '@nestjs/common';

import { TypeOrmModule } from '@nestjs/typeorm';

import { Favorite } from './domain/entities/favorite.entity';
import { User } from '@/modules/user/domain/entities/user.entity';
import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/entities/listing.orm-entity';

import { FavoritosController } from './infrastructure/controllers/favoritos.controller';

import { FavoriteRepositoryPort } from './application/ports/favorite-repository.port';

import { FavoriteTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/favorite.typeorm.repository';

import { AddFavoriteUseCase } from './application/use-cases/add-favorite.usecase';
import { RemoveFavoriteUseCase } from './application/use-cases/remove-favorite.usecase';
import { GetMyFavoritesUseCase } from './application/use-cases/get-my-favorites.usecase';
import { IsFavoriteUseCase } from './application/use-cases/is-favorite.usecase';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Favorite,
      User,
      ListingOrmEntity,
    ]),
  ],

  controllers: [FavoritosController],

  providers: [
    AddFavoriteUseCase,
    RemoveFavoriteUseCase,
    GetMyFavoritesUseCase,
    IsFavoriteUseCase,

    {
      provide: FavoriteRepositoryPort,
      useClass: FavoriteTypeOrmRepository,
    },
  ],

  exports: [FavoriteRepositoryPort],
})
export class FavoritosModule {}
