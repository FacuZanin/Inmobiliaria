// backend\src\modules\admin-documentos\domain\entities\documento-audit.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

export enum DocumentoAuditAction {
  CREADO = 'CREADO',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  DESCARGADO = 'DESCARGADO',
  ELIMINADO = 'ELIMINADO',
  EN_ANALISIS = 'EN_ANALISIS',
  REEMPLAZADO = 'REEMPLAZADO',
}

export enum DocumentoTipo {
  INQUILINO = 'INQUILINO',
  PROPIETARIO = 'PROPIETARIO',
}

@Entity('documento_audit')
export class DocumentoAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentoId: number;

  @Column({
    type: 'enum',
    enum: DocumentoTipo,
  })
  documentoTipo: DocumentoTipo;

  @Column({
    type: 'enum',
    enum: DocumentoAuditAction,
  })
  action: DocumentoAuditAction;

  @Column()
  performedById: number;

  @Column({ type: 'text', nullable: true })
  comentario: string | null;

  @Column({ type: 'jsonb', nullable: true })
  datosExtras: any;

  @Column({ type: 'jsonb', nullable: true })
  analisisIA: any;

  @CreateDateColumn()
  createdAt: Date;
}


