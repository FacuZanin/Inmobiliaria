import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_lotes')
export class PropiedadLote {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  superficieTotal: number;

  @Column({ nullable: true })
  zonificacion: string;

  @Column({ nullable: true })
  frente: number;

  @Column({ nullable: true })
  fondo: number;

  @OneToOne(() => Propiedad, (p) => p.lote, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  propiedad: Propiedad;
}
