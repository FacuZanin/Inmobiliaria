import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Propiedad } from '../../propiedades/entities/propiedad.entity';
import { User } from '../../users/user.entity/user.entity';
import { Agencia } from '../../agencias/entities/agencia.entity';
import { TipoOperacion } from '../../common/enums/operacion-tipo.enum';
import { OperacionEstado } from '../../common/enums/operacion-estado.enum';
import { MedioOperacion } from '../../common/enums/medio-operacion.enum';

@Entity('operaciones')
export class Operacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: TipoOperacion })
  tipo: TipoOperacion;

  @Column({
    type: 'enum',
    enum: OperacionEstado,
    default: OperacionEstado.PENDIENTE,
  })
  estado: OperacionEstado;

  @Column({ type: 'enum', enum: MedioOperacion, nullable: true })
  medio: MedioOperacion;

  @ManyToOne(() => Propiedad, (p) => p.id, { eager: true })
  propiedad: Propiedad;

  @ManyToOne(() => Agencia, (a) => a.id, { nullable: true, eager: true })
  agencia?: Agencia;

  @ManyToOne(() => User, (u) => u.id, { nullable: true, eager: true })
  propietarioDirecto?: User;

  @ManyToOne(() => User, (u) => u.id, { nullable: false, eager: true })
  creadoPor: User;

  @ManyToOne(() => User, (u) => u.id, { nullable: true, eager: true })
  compradorInquilino?: User;

  @Column({ type: 'timestamp', nullable: true })
  fechaReserva: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  fechaFinalizacion: Date | null;

  @Column({ type: 'text', nullable: true })
  observaciones: string | null;

  @CreateDateColumn()
  creadoEn: Date;
}
