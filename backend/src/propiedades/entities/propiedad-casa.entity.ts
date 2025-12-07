import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_casas')
export class PropiedadCasa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  antiguedad: number;

  @Column({ default: false })
  garage: boolean;

  @Column({ default: false })
  patio: boolean;

  @Column({ default: false })
  quincho: boolean;

  @Column({ default: false })
  pileta: boolean;

  @Column({ nullable: true })
  superficieTerreno: number;

  @Column({ nullable: true })
  superficieConstruida: number;

@OneToOne(() => Propiedad, (p) => p.casa, {
  onDelete: 'CASCADE',
  eager: false,
})
@JoinColumn()
propiedad: Propiedad;

}
