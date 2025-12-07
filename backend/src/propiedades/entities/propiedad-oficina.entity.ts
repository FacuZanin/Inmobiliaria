import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_oficinas')
export class PropiedadOficina {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  puestos: number;

  @Column({ default: false })
  salaReuniones: boolean;

  @Column({ default: false })
  kitchenette: boolean;

  @Column({ nullable: true })
  baños: number;

  @Column({ nullable: true })
  expensas: number;

@OneToOne(() => Propiedad, (p) => p.oficina, {
  onDelete: 'CASCADE',
  eager: false,
})
@JoinColumn()
propiedad: Propiedad;

}
