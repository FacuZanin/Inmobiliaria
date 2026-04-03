// backend\src\modules\inquilino-documentos\domain\entities\inquilino-documento.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Inquilino } from '../../../inquilinos/domain/entities/inquilino.entity';
import { DocumentoEstado} from '@shared/enums/documento-estado.enum';

import { DocumentoAuditAction } from '@shared/enums/documento-audit-action.enum';
import { TipoDocumentoInquilino } from '@shared/enums/tipo-documento-inquilino.enum';

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
