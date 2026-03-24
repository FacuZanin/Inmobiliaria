// backend\src\modules\agencias\domain\entities\agencia.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../../user/domain/entities/user.entity';

@Entity('agencias')
export class Agencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  nombre: string | null;

  @Column({ length: 50 })
  direccion: string;

  @Column({ length: 100 })
  localidad: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', length: 255, nullable: true })
  logoUrl: string | null;

  @OneToMany(() => User, (user) => user.agencia)
  empleados: User[];
}
