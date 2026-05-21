// backend\src\modules\publicaciones\infrastructure\persistence\typeorm\mappers\entities\publicacion.entity.ts
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

import { PropertyEntity } from '@/modules/propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

@Entity('publicaciones')
export class PublicacionEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  propertyId!: number;

  @ManyToOne(() => PropertyEntity, {
    eager: false,
    nullable: false,
  })
  @JoinColumn({
    name: 'propertyId',
  })
  propiedad!: PropertyEntity;

  @Column({
    type: 'enum',
    enum: PublicacionStatus,
    default: PublicacionStatus.EN_REVISION,
  })
  status!: PublicacionStatus;

  @Column({
    default: true,
  })
  visible!: boolean;

  @Column({
    default: false,
  })
  verified!: boolean;

  @Column({
    default: false,
  })
  featured!: boolean;

  @Column({
    type: 'float',
    nullable: true,
  })
  moderationScore!: number | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  moderationNotes!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  publicadoEn!: Date | null;

  @CreateDateColumn({
    name: 'creadoEn',
  })
  creadoEn!: Date;
}