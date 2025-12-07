import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Inquilino } from './inquilino.entity';
import { Propiedad } from '../../propiedades/entities/propiedad.entity';

@Entity('favoritos')
export class Favorito {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Inquilino)
  inquilino: Inquilino;

  @ManyToOne(() => Propiedad)
  propiedad: Propiedad;
}