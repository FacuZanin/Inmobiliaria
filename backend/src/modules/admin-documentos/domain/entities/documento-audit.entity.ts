// backend\src\modules\admin-documentos\domain\entities\documento-audit.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

import { DocumentoTipo } from '@shared/contracts/enums/documento-tipo.enum';
import { DocumentoAuditAction } from '@shared/contracts/enums/documento-audit-action.enum';

@Entity('documento_audit')
export class DocumentoAudit {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  documentoId!: number;

  @Column({
    type: 'enum',
    enum: DocumentoTipo,
  })
  documentoTipo!: DocumentoTipo;

  @Column({
    type: 'enum',
    enum: DocumentoAuditAction,
  })
  action!: DocumentoAuditAction;

  @Column()
  performedById!: number;

  @Column({ type: 'text', nullable: true })
  comentario!: string | null;

  @Column({ type: 'jsonb', nullable: true })
  datosExtras: any;

  @Column({ type: 'jsonb', nullable: true })
  analisisIA: any;

  @Column({ type: 'json', nullable: true })
  metadata?: Record<string, any>;

  @CreateDateColumn()
  createdAt!: Date;
}
