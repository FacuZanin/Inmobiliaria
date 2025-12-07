import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_pozos')
export class PropiedadPozo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  fechaEntrega: Date;

  @Column({ nullable: true })
  avancePorcentaje: number;

  @Column({ type: 'text', nullable: true })
  tipologias: string;

  @Column({ nullable: true })
  constructora: string;

@OneToOne(() => Propiedad, (p) => p.pozo, {
  onDelete: 'CASCADE',
  eager: false,
})
@JoinColumn()
propiedad: Propiedad;

}
