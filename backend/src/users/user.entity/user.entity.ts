import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Agencia } from '../../agencias/entities/agencia.entity'
import { UserRole } from '../../common/enums/user-role.enum';


@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  nombre: string;

  @Column({ length: 100 })
  apellido: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  role: UserRole;

  // Para inmobiliarias y sus empleados
  @Column({ nullable: true })
  agenciaId: number;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  avatarUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @ManyToOne(() => Agencia, (agencia) => agencia.empleados, { nullable: true })
  agencia: Agencia;

}
