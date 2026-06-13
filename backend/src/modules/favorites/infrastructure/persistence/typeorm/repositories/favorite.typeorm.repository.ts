// backend/src/modules/favoritos/infrastructure/persistence/typeorm/repositories/favorite.typeorm.repository.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Favorite } from '@/modules/favorites/domain/entities/favorite.entity';
import { FavoriteRepositoryPort } from '@/modules/favorites/application/ports/favorite-repository.port';
import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing.orm-entity';

@Injectable()
export class FavoriteTypeOrmRepository implements FavoriteRepositoryPort {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(ListingOrmEntity)
    private readonly listingRepository: Repository<ListingOrmEntity>,
  ) {}

  async addFavorite(userId: number, propertyId: number): Promise<Favorite> {
    const listing = await this.listingRepository.findOne({
      where: {
        id: propertyId,
      },
    });

    if (!listing) {
      throw new NotFoundException('Listing no encontrado');
    }

    const exists = await this.favoriteRepository.exists({
      where: {
        user: { id: userId },
        listing: { id: propertyId },
      },
    });

    if (exists) {
      throw new ConflictException('El listing ya esta en favoritos');
    }

    const favorite = this.favoriteRepository.create({
      user: { id: userId },
      listing: { id: propertyId },
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: number, propertyId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        listing: { id: propertyId },
      },
    });

    if (!favorite) {
      throw new NotFoundException('Favorito no encontrado');
    }

    await this.favoriteRepository.remove(favorite);
  }

  async getUserFavorites(userId: number): Promise<Favorite[]> {
    return this.favoriteRepository
      .createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.listing', 'listing')
      .where('favorite.user.id = :userId', {
        userId,
      })
      .orderBy('favorite.createdAt', 'DESC')
      .getMany();
  }

  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    return this.favoriteRepository.exists({
      where: {
        user: { id: userId },
        listing: { id: propertyId },
      },
    });
  }

  async countByProperty(propertyId: number): Promise<number> {
    return this.favoriteRepository.count({
      where: {
        listing: { id: propertyId },
      },
    });
  }
}
