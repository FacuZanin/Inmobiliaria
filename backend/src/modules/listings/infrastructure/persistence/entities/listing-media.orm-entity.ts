// backend/src/modules/listings/infrastructure/persistence/entities/listing-media.orm-entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { ListingOrmEntity } from './listing.orm-entity';
import { ListingMediaType } from '@modules/listings/domain/enums/listing-media-type.enum';
import { MediaProcessingStatus } from '@modules/listings/domain/enums/media-processing-status.enum';

@Entity('listing_media')
export class ListingMediaOrmEntity {

  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(
    () => ListingOrmEntity,
    (listing) => listing.media,
    {
      nullable: false,
      onDelete: 'CASCADE',
    },
  )
  listing!: ListingOrmEntity;

  @Index()
  @Column()
  listingId!: number;

  @Index()
  @Column({
    type: 'enum',
    enum: ListingMediaType,
  })
  type!: ListingMediaType;

  @Column({
    type: 'varchar',
    length: 2048,
  })
  url!: string;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  storageKey!: string | null;

  @Column({
    type: 'varchar',
    length: 2048,
    nullable: true,
  })
  thumbnailUrl!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  filename!: string | null;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  mimeType!: string | null;

  @Column({
    type: 'bigint',
    nullable: true,
  })
  size!: number | null;

  @Column({
    type: 'int',
    default: 0,
  })
  sortOrder!: number;

  @Column({
    type: 'boolean',
    default: false,
  })
  isPrimary!: boolean;

  @Index()
  @Column({
    type: 'enum',
    enum: MediaProcessingStatus,
    default: MediaProcessingStatus.PENDING,
  })
  processingStatus!: MediaProcessingStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  processingError!: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata!: Record<string, any> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
