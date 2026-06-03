// backend/src/modules/favoritos/domain/entities/favorite.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

import { User } from '@/modules/users/domain/entities/user.entity';

import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing.orm-entity';

@Entity('favorites')
@Unique(['user', 'listing'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @Index()
  @ManyToOne(() => ListingOrmEntity, {
    onDelete: 'CASCADE',
  })
  listing!: ListingOrmEntity;

  @CreateDateColumn()
  createdAt!: Date;
}
