// backend\src\modules\documents\infrastructure\persistence\typeorm\entities\document-audit.orm-entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

import { DocumentAuditAction } from '@/modules/documents/domain/enums/document-audit-action.enum';
import type { DocumentAuditMetadata } from '@/modules/documents/domain/entities/document-audit.entity';

@Entity('document_audits')
export class DocumentAuditOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column()
  documentId!: number;

  @Column({
    type: 'enum',
    enum: DocumentAuditAction,
  })
  action!: DocumentAuditAction;

  @Column()
  performedBy!: number;

  @Column({
    type: 'json',
    nullable: true,
  })
  metadata!: DocumentAuditMetadata | null;

  @CreateDateColumn()
  createdAt!: Date;
}
