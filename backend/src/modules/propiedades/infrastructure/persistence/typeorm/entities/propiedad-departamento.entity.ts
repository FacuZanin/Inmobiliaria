// backend\src\modules\propiedades\infrastructure\persistence\typeorm\entities\propiedad-departamento.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { PropertyEntity } from './propiedad.entity';

@Entity('propiedad_departamentos')
export class PropiedadDepartamento {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ nullable: true })
  piso?: number;

  @Column({ nullable: true })
  unidad?: string;

  @Column({ default: false })
  ascensor?: boolean;

  @Column({ nullable: true })
  expensas?: number;

  @Column({ nullable: true })
  superficieBalcon?: number;

  @Column({ default: false })
  cochera?: boolean;

  @OneToOne(() => PropertyEntity, (p) => p.departamento, {
    onDelete: 'CASCADE',
    eager: false,
  })
  @JoinColumn()
  propiedad!: PropertyEntity;
}
