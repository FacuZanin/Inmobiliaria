// backend\src\modules\agencias\domain\entities\agencia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';

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

  @Column({ type: 'boolean', default: true })
  activa!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadaEn!: Date;
}
