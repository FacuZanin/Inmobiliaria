import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  Column,
} from 'typeorm';

import { User } from '../../users/user.entity/user.entity';
import { SolicitudVisita } from './solicitud-visita.entity';
import { Favorito } from './favorito.entity';

@Entity('inquilinos')
export class Inquilino {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, { eager: true })
  @JoinColumn()
  user: User;

  @OneToMany(() => SolicitudVisita, (s) => s.inquilino)
  solicitudesVisita: SolicitudVisita[];

  @OneToMany(() => Favorito, (f) => f.inquilino)
  favoritos: Favorito[];

  @Column({ nullable: true })
  telefonoAlternativo?: string;

  @Column({ nullable: true })
  ingresosMensuales?: number;

  @Column({ nullable: true })
  antiguedadLaboralMeses?: number;

  @Column({ nullable: true })
  tieneGarante?: boolean;

  @Column({ nullable: true })
  tieneMascota?: boolean;

  @Column({ nullable: true })
  operacionBuscada?: 'ALQUILER' | 'COMPRA';

  @Column({ nullable: true })
  presupuestoMaximo?: number;

  @Column({ type: 'simple-array', nullable: true })
  zonasPreferidas?: string[];
}
