// backend\src\modules\propietario-documentos\domain\entities\propietario-documento.domain.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../../../modules/user/domain/entities/user.entity';
import { DocumentoEstado } from '@shared/enums/documento-estado.enum';
import { TipoDocumentoPropietario } from '@shared/enums/tipo-documento-propietario.enum';

@Entity('propietario_documentos')
export class PropietarioDocumento {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, { eager: true })
  propietario!: User;

  @Column({ type: 'int', nullable: true })
  propiedadId?: number | null;

  @Column({
    type: 'enum',
    enum: TipoDocumentoPropietario,
  })
  tipoDocumento!: TipoDocumentoPropietario;

  @Column()
  archivoUrl!: string;

  @Column({
    type: 'enum',
    enum: DocumentoEstado,
    default: DocumentoEstado.PENDIENTE,
  })
  estado!: DocumentoEstado;

  @Column({ type: 'text', nullable: true })
  comentarioRechazo!: string | null;

  @CreateDateColumn()
  fechaSubida!: Date;
}
