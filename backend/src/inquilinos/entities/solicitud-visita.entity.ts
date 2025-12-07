import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { Inquilino } from './inquilino.entity';
import { Propiedad } from '../../propiedades/entities/propiedad.entity';

export type EstadoVisita = 'PENDIENTE' | 'ACEPTADA' | 'RECHAZADA';

@Entity('solicitudes_visita')
export class SolicitudVisita {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inquilino)
  inquilino: Inquilino;

  @ManyToOne(() => Propiedad)
  propiedad: Propiedad;

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
