// backend\src\modules\agencias\domain\entities\agencia-solicitud.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';

import { AgenciaSolicitudEstado } from '@shared/enums/agencia-solicitud-estado.enum';

@Entity('agencia_solicitudes')
export class AgenciaSolicitud {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, {
    eager: true,
    onDelete: 'CASCADE',
  })
  usuario: User;

  @Column({ length: 150 })
  nombreTitular: string;

  @Column({ length: 20 })
  dni: string;

  @Column({ length: 20 })
  cuit: string;

  @Column({ length: 50 })
  matricula: string;

  @Column({ length: 100 })
  colegio: string;

  @Column({ length: 100 })
  provincia: string;

  @Column({
    type: 'enum',
    enum: AgenciaSolicitudEstado,
    default: AgenciaSolicitudEstado.PENDIENTE,
  })
  estado: AgenciaSolicitudEstado;

  @Column({ length: 255 })
  dniFrente: string;

  @Column({ length: 255 })
  dniDorso: string;

  @Column({ length: 255 })
  constanciaCuit: string;

  @Column({ length: 255 })
  constanciaAfip: string;

  @Column({ length: 255 })
  certificadoMatricula: string;

  @Column({ length: 255 })
  carnetProfesional: string;

  @CreateDateColumn()
  creadaEn: Date;
}
