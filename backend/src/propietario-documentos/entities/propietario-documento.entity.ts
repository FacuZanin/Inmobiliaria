import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { User } from '../../users/user.entity/user.entity';
import { Propiedad } from '../../propiedades/entities/propiedad.entity';
import { DocumentoEstado } from '../../common/enums/documento-estado.enum';

export enum TipoDocumentoPropietario {
  DNI_FRENTE = 'DNI_FRENTE',
  DNI_DORSO = 'DNI_DORSO',
  ESCRITURA = 'ESCRITURA',
  DOMINIO = 'DOMINIO',
  SERVICIO = 'SERVICIO',
}

@Entity('propietario_documentos')
export class PropietarioDocumento {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, { eager: true })
  propietario: User;

  @ManyToOne(() => Propiedad, { nullable: true })
  propiedad?: Propiedad | null;

  @Column({
    type: 'enum',
    enum: TipoDocumentoPropietario,
  })
  tipoDocumento: TipoDocumentoPropietario;

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
