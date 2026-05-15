// backend/src/modules/favoritos/infrastructure/persistence/typeorm/repositories/favorite.typeorm.repository.ts
import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';

import { Repository } from 'typeorm';

import { Favorite } from '@/modules/favoritos/domain/entities/favorite.entity';
import { FavoriteRepositoryPort } from '@/modules/favoritos/application/ports/favorite-repository.port';

import { User } from '@/modules/user/domain/entities/user.entity';

import { Propiedad } from '@/modules/propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

@Injectable()
export class FavoriteTypeOrmRepository implements FavoriteRepositoryPort {
  constructor(
    @InjectRepository(Favorite)
    private readonly favoriteRepository: Repository<Favorite>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Propiedad)
    private readonly propertyRepository: Repository<Propiedad>,
  ) {}

  async addFavorite(userId: number, propertyId: number): Promise<Favorite> {
    const property = await this.propertyRepository.findOne({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Propiedad no encontrada');
    }

    const exists = await this.favoriteRepository.exists({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });

    if (exists) {
      throw new ConflictException('La propiedad ya está en favoritos');
    }

    const favorite = this.favoriteRepository.create({
      user: { id: userId },
      property: { id: propertyId },
    });

    return this.favoriteRepository.save(favorite);
  }

  async removeFavorite(userId: number, propertyId: number): Promise<void> {
    const favorite = await this.favoriteRepository.findOne({
      where: {
        user: { id: userId },
        property: { id: propertyId },
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

      .leftJoinAndSelect('favorite.property', 'property')

      .where('favorite.user.Id = :userId', {
        userId,
      })

      .orderBy('favorite.createdAt', 'DESC')

      .getMany();
  }

  async isFavorite(userId: number, propertyId: number): Promise<boolean> {
    return this.favoriteRepository.exists({
      where: {
        user: { id: userId },
        property: { id: propertyId },
      },
    });
  }

  async countByProperty(propertyId: number): Promise<number> {
    return this.favoriteRepository.count({
      where: {
        property: { id: propertyId },
      },
    });
  }
}
