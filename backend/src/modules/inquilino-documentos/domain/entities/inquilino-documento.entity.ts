// backend\src\modules\inquilino-documentos\domain\entities\inquilino-documento.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Inquilino } from '../../../inquilinos/domain/entities/inquilino.entity';
import { DocumentoEstado} from '@shared/contracts';

export enum TipoDocumentoInquilino {
  DNI_FRENTE = 'DNI_FRENTE',
  DNI_DORSO = 'DNI_DORSO',
  RECIBO_SUELDO = 'RECIBO_SUELDO',
  GARANTIA_PROPIETARIA = 'GARANTIA_PROPIETARIA',
  SEGURO_CAUCION = 'SEGURO_CAUCION',
  CERTIFICADO_LABORAL = 'CERTIFICADO_LABORAL',
  SERVICIO = 'SERVICIO',
  CBU = 'CBU',
}

export enum DocumentoAuditAction {
  CREADO = 'CREADO',
  APROBADO = 'APROBADO',
  RECHAZADO = 'RECHAZADO',
  DESCARGADO = 'DESCARGADO',
  ELIMINADO = 'ELIMINADO',
  EN_ANALISIS = 'EN_ANALISIS',
  REEMPLAZADO = 'REEMPLAZADO',
}


@Entity('inquilino_documentos')
export class InquilinoDocumento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inquilino, { eager: true })
  inquilino: Inquilino;

  @Column({
    type: 'enum',
    enum: TipoDocumentoInquilino,
  })
  tipoDocumento: TipoDocumentoInquilino;

  @Column()
  archivoUrl: string;

  @Column({
    type: 'enum',
    enum: DocumentoEstado,
    default: DocumentoEstado.PENDIENTE,
  })
  estado: DocumentoEstado;

  @Column({ type: 'text', nullable: true })
  comentarioRechazo: string | null;

  @CreateDateColumn()
  fechaSubida: Date;
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

  @Column({ type: 'jsonb', nullable: true })
  analisisIA?: any;

  @Column({ type: 'jsonb', nullable: true })
  datosExtras?: any;
}