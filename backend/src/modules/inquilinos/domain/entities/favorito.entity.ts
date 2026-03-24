// backend\src\modules\inquilinos\domain\entities\favorito.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Inquilino } from './inquilino.entity';

@Entity('favoritos')
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inquilino, (inquilino) => inquilino.favoritos, {
    onDelete: 'CASCADE',
  })
  inquilino: Inquilino;

  @Column({ type: 'int' })
  propiedadId: number;
}
