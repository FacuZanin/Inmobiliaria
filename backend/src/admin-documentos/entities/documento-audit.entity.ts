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

@Entity('documento_audit')
export class DocumentoAudit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  documentoId: number;

  @Column()
  documentoTipo: 'INQUILINO' | 'PROPIETARIO';

  @Column({
    type: 'enum',
    enum: DocumentoAuditAction,
  })
  action: DocumentoAuditAction;

  @Column()
  performedById: number;

  @Column({ type: 'text', nullable: true })
  comentario: string | null;

  @CreateDateColumn()
  createdAt: Date;
}
