// backend\src\modules\favoritos\domain\entities\favorite.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  Unique,
  Index,
} from 'typeorm';

import { User } from '@/modules/user/domain/entities/user.entity';
import { Propiedad } from '@/modules/propiedades/infrastructure/persistence/typeorm/entities/propiedad.entity';

@Entity('favoritos')
@Unique(['user', 'property'])
export class Favorite {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @ManyToOne(() => User, {
    onDelete: 'CASCADE',
  })
  user!: User;

  @Index()
  @ManyToOne(() => Propiedad, {
    onDelete: 'CASCADE',
  })
  property!: Propiedad;

  @CreateDateColumn()
  createdAt!: Date;
}