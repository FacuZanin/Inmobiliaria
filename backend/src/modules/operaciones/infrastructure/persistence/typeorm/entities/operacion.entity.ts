// backend\src\modules\operaciones\infrastructure\persistence\typeorm\entities\operacion.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
} from 'typeorm';
import { Propiedad } from '../../../../../propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';
import { User } from '../../../../../user/domain/entities/user.entity';
import { Agencia } from '../../../../../agencias/domain/entities/agencia.entity';
import { MedioOperacion} from '@shared/enums/medio-operacion.enum';
import { OperacionTipo } from '@shared/enums/operacion-tipo.enum';
import { OperacionEstado } from '@shared/enums/operacion-estado.enum';

@Entity('operaciones')
export class Operacion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum', enum: OperacionTipo })
  tipo: OperacionTipo;

  @Column({
    type: 'enum',
    enum: OperacionEstado,
    default: OperacionEstado.PENDIENTE,
  })
  estado: OperacionEstado;

@Column({ type: 'enum', enum: MedioOperacion, nullable: true })
medio: MedioOperacion | null;

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
