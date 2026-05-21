// backend\src\modules\propiedades\infrastructure\persistence\typeorm\entities\propiedad-campo.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { PropertyEntity } from './propiedad.entity';

@Entity('propiedad_campos')
export class PropiedadCampo {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  hectareas!: number;

  @Column({ nullable: true })
  apto!: string;

  @Column({ type: 'text', nullable: true })
  mejoras!: string;

  @OneToOne(() => PropertyEntity, (p) => p.campo, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  propiedad!: PropertyEntity;
}
