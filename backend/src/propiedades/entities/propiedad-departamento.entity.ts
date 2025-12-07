import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_departamentos')
export class PropiedadDepartamento {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  piso: number;

  @Column({ nullable: true })
  unidad: string;

  @Column({ default: false })
  ascensor: boolean;

  @Column({ nullable: true })
  expensas: number;

  @Column({ nullable: true })
  superficieBalcon: number;

  @Column({ default: false })
  cochera: boolean;

@OneToOne(() => Propiedad, (p) => p.departamento, {
  onDelete: 'CASCADE',
  eager: false,
})
@JoinColumn()
propiedad: Propiedad;

}
