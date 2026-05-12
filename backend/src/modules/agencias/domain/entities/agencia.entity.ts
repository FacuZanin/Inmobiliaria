// backend\src\modules\agencias\domain\entities\agencia.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';

import { User } from '../../../user/domain/entities/user.entity';

import { AgenciaStatus } from '@shared/contracts/enums/agencia-status.enum';

@Entity('agencias')
export class Agencia {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  nombre!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  direccion!: string | null;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  localidad!: string | null;

  @Column({
    type: 'varchar',
    unique: true,
    length: 150,
    nullable: true,
  })
  email!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  telefono!: string | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
  })
  logoUrl!: string | null;

  @OneToMany(() => User, (user) => user.agencia)
  empleados!: User[];

  @Column({
    type: 'enum',
    enum: AgenciaStatus,
    default: AgenciaStatus.ACTIVA,
  })
  status!: AgenciaStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  motivoSuspension!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  suspendidaEn!: Date | null;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date | null;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  creadaEn!: Date;
}