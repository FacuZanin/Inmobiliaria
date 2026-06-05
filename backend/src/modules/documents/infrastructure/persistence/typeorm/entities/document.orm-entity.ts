// backend\src\modules\documents\infrastructure\persistence\typeorm\entities\document.orm-entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Unique,
} from 'typeorm';

import { DocumentStatus } from '@/modules/documents/domain/enums/document-status.enum';
import { DocumentType } from '@/modules/documents/domain/enums/document-type.enum';
import { DocumentOwnerType } from '@/modules/documents/domain/enums/document-owner-type.enum';

@Entity('documents')
@Index(['ownerId', 'ownerType'])
@Index(['status'])
@Unique(['ownerId', 'ownerType', 'type'])
export class DocumentOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  ownerId!: number;

  @Column({
    type: 'enum',
    enum: DocumentOwnerType,
  })
  ownerType!: DocumentOwnerType;

  @Column({
    type: 'enum',
    enum: DocumentType,
  })
  type!: DocumentType;

  @Column({
    type: 'text',
  })
  fileUrl!: string;

  @Column({
    type: 'enum',
    enum: DocumentStatus,
    default: DocumentStatus.PENDING,
  })
  status!: DocumentStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  rejectionReason!: string | null;

  @Column({
    nullable: true,
  })
  reviewedBy!: number | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  reviewedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
