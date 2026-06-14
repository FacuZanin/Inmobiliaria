import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { MediaAssetType } from '@/modules/media/domain/enums/media-asset-type.enum';
import { MediaOwnerType } from '@/modules/media/domain/enums/media-owner-type.enum';
import { MediaProcessingStatus } from '@/modules/media/domain/enums/media-processing-status.enum';

@Entity('media_assets')
@Index(['ownerType', 'ownerId'])
@Index(['status'])
export class MediaAssetOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: MediaOwnerType,
  })
  ownerType!: MediaOwnerType;

  @Column({
    type: 'int',
  })
  ownerId!: number;

  @Column({
    type: 'enum',
    enum: MediaAssetType,
    default: MediaAssetType.IMAGE,
  })
  type!: MediaAssetType;

  @Column({
    type: 'varchar',
    length: 2048,
  })
  url!: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 2048,
  })
  storageKey!: string;

  @Column({
    type: 'varchar',
    length: 255,
  })
  originalName!: string;

  @Column({
    type: 'varchar',
    length: 120,
  })
  mimeType!: string;

  @Column({
    type: 'bigint',
    transformer: {
      to: (value?: number | null) => value,
      from: (value?: string | null) =>
        value !== null && value !== undefined ? Number(value) : 0,
    },
  })
  sizeInBytes!: number;

  @Column({
    type: 'int',
  })
  uploadedById!: number;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  collection!: string | null;

  @Column({
    type: 'enum',
    enum: MediaProcessingStatus,
    default: MediaProcessingStatus.PENDING,
  })
  status!: MediaProcessingStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  processingError!: string | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  metadata!: Record<string, unknown> | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
