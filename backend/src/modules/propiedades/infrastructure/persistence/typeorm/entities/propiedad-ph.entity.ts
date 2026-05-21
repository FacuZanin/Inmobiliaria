// backend\src\modules\propiedades\infrastructure\persistence\typeorm\entities\propiedad-ph.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { PropertyEntity } from './propiedad.entity';

@Entity('propiedad_phs')
export class PropiedadPH {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'float',
    nullable: true,
  })
  porcentajeLote!: number | null;

  @Column({
    default: false,
  })
  entradaIndividual!: boolean;

  @Column({
    default: false,
  })
  patio!: boolean;

  @Column({
    type: 'float',
    nullable: true,
  })
  expensas!: number | null;

  @OneToOne(
    () => PropertyEntity,
    (p) => p.ph,
    {
      onDelete: 'CASCADE',
      eager: false,
    },
  )
  @JoinColumn()
  propiedad!: PropertyEntity;
}