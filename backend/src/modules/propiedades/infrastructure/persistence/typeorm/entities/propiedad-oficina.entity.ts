// backend\src\modules\propiedades\infrastructure\persistence\typeorm\entities\propiedad-oficina.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyEntity } from './propiedad.entity';

@Entity('propiedad_oficinas')
export class PropiedadOficina {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  puestos!: number;

  @Column({ default: false })
  salaReuniones!: boolean;

  @Column({ default: false })
  kitchenette!: boolean;

  @Column({ nullable: true })
  banos!: number;

  @Column({ nullable: true })
  expensas!: number;

@OneToOne(() => PropertyEntity, (p) => p.oficina, {
  onDelete: 'CASCADE',
  eager: false,
})
@JoinColumn()
propiedad!: PropertyEntity;

}
