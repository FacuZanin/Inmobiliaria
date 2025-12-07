import {
  Entity, PrimaryGeneratedColumn, Column,
  ManyToOne, CreateDateColumn
} from 'typeorm';
import { User } from '../../users/user.entity/user.entity';

@Entity('agencia_solicitudes')
export class AgenciaSolicitud {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (u) => u.id, { eager: true })
  usuario: User;

  @Column()
  nombreTitular: string;

  @Column()
  dni: string;

  @Column()
  cuit: string;

  @Column()
  matricula: string;

  @Column()
  colegio: string;

  @Column()
  provincia: string;

  @Column({
    type: 'enum',
    enum: ['PENDIENTE', 'APROBADA', 'RECHAZADA'],
    default: 'PENDIENTE'
  })
  estado: string;

  // DOCUMENTACIÓN OBLIGATORIA
  @Column()
  dniFrente: string;

  @Column()
  dniDorso: string;

  @Column()
  constanciaCuit: string;

  @Column()
  constanciaAfip: string;

  @Column()
  certificadoMatricula: string;

  @Column()
  carnetProfesional: string;

  @CreateDateColumn()
  creadaEn: Date;
}
