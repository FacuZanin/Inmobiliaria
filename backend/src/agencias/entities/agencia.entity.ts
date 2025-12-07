import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { User } from '../../users/user.entity/user.entity';

@Entity('agencias')
export class Agencia {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  nombre: string;

  @Column({ length: 200 })
  direccion: string;

  @Column({ length: 100 })
  localidad: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  telefono: string;

  @Column({ nullable: true })
  logoUrl: string;

  @OneToMany(() => User, (user) => user.agencia)
  empleados: User[];
}
