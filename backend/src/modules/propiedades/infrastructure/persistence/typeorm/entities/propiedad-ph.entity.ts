// backend\src\modules\propiedades\infrastructure\persistence\typeorm\entities\propiedad-ph.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Propiedad } from './propiedad.entity';

@Entity('propiedad_phs')
export class PropiedadPH {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  porcentajeLote: number;

  @Column({ default: false })
  entradaIndividual: boolean;

  @Column({ default: false })
  patio: boolean;

  @Column({ nullable: true })
  expensas: number;

  @OneToOne(() => Propiedad, (p) => p.ph, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  propiedad: Propiedad;
}
