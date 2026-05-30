// backend/src/modules/listings/infrastructure/persistence/entities/listing.orm-entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { User } from '@modules/user/domain/entities/user.entity';

import { Agencia } from '@modules/agencias/domain/entities/agencia.entity';

import { Favorite } from '@modules/favoritos/domain/entities/favorite.entity';

import { ListingMediaOrmEntity } from './listing-media.orm-entity';

import { ListingCategory } from '@modules/listings/domain/enums/listing-category.enum';

import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';

import { ListingVisibility } from '@modules/listings/domain/enums/listing-visibility.enum';

import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';

import { OperationType } from '@modules/listings/domain/enums/operation-type.enum';

import { PropertyType } from '@modules/listings/domain/enums/property-type.enum';

@Entity('listings')
export class ListingOrmEntity {
  // =====================================================
  // IDENTITY
  // =====================================================

  @PrimaryGeneratedColumn()
  id!: number;

  // =====================================================
  // CORE
  // =====================================================

  @Index()
  @Column({
    type: 'varchar',
    length: 250,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: ListingCategory,
    default: ListingCategory.REAL_ESTATE,
  })
  category!: ListingCategory;

  @Index()
  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  propertyType!: PropertyType;

  @Index()
  @Column({
    type: 'enum',
    enum: OperationType,
  })
  operationType!: OperationType;

  // =====================================================
  // STATUS
  // =====================================================

  @Index()
  @Column({
    type: 'enum',
    enum: ListingStatus,
    default: ListingStatus.DRAFT,
  })
  status!: ListingStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: ModerationStatus,
    default: ModerationStatus.PENDING_REVIEW,
  })
  moderationStatus!: ModerationStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  moderationReason!: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: ListingVisibility,
    default: ListingVisibility.PUBLIC,
  })
  visibility!: ListingVisibility;

  // =====================================================
  // PRICING
  // =====================================================

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  salePrice!: number | null;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  rentalPrice!: number | null;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
  })
  expenses!: number | null;

  // =====================================================
  // LOCATION
  // =====================================================

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  address!: string | null;

  @Index()
  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  city!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
  })
  latitude!: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
  })
  longitude!: number | null;

  // =====================================================
  // FEATURES
  // =====================================================

  @Column({
    type: 'int',
    nullable: true,
  })
  rooms!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  bedrooms!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  bathrooms!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  coveredArea!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  totalArea!: number | null;

  // =====================================================
  // FLEXIBLE DETAILS
  // =====================================================

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  details!: Record<string, any> | null;

  // =====================================================
  // RELATIONS
  // =====================================================

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner!: User;

  @Index()
  @Column()
  ownerId!: number;

  @ManyToOne(() => Agencia, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  agency!: Agencia | null;

  @Index()
  @Column({
    nullable: true,
  })
  agencyId!: number | null;

  @OneToMany(
    () => ListingMediaOrmEntity,
    (media) => media.listing,
    {
      cascade: true,
    },
  )
  media!: ListingMediaOrmEntity[];

  @OneToMany(
    () => Favorite,
    (favorite) => favorite.listing,
  )
  favorites!: Favorite[];

  // =====================================================
  // ANALYTICS
  // =====================================================

  @Column({
    type: 'int',
    default: 0,
  })
  viewsCount!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  contactsCount!: number;

  @Column({
    type: 'int',
    default: 0,
  })
  favoritesCount!: number;

  // =====================================================
  // SEO
  // =====================================================

  @Index({
    unique: true,
  })
  @Column({
    type: 'varchar',
    length: 300,
    nullable: true,
  })
  slug!: string | null;

  // =====================================================
  // SOFT DELETE
  // =====================================================

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date | null;

  // =====================================================
  // TIMESTAMPS
  // =====================================================

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}