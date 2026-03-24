// backend\src\modules\inquilinos\domain\entities\solicitud-visita.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';

import { Inquilino } from './inquilino.entity';

export type EstadoVisita = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

@Entity('solicitudes_visita')
export class SolicitudVisita {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inquilino)
  inquilino: Inquilino;

  @Column()
  propiedadId: number;

  @Column()
  mensaje: string;

  @Column({ type: 'timestamp' })
  fechaDeseada: Date;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'ACEPTADA', 'RECHAZADA'],
    default: 'PENDIENTE',
  })
  estado: EstadoVisita;

  @CreateDateColumn()
  creadoEl: Date;
}
