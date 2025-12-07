import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Agencia } from '../../agencias/entities/agencia.entity';
import { User } from '../../users/user.entity/user.entity';
import { TipoPropiedad } from '../../common/enums/propiedad-tipo.enum';
import { TipoOperacion } from '../../common/enums/operacion-tipo.enum';

import { PropiedadCasa } from './propiedad-casa.entity';
import { PropiedadDepartamento } from './propiedad-departamento.entity';
import { PropiedadLote } from './propiedad-lote.entity';
import { PropiedadLocal } from './propiedad-local.entity';
import { PropiedadOficina } from './propiedad-oficina.entity';
import { PropiedadCampo } from './propiedad-campo.entity';
import { PropiedadPH } from './propiedad-ph.entity';
import { PropiedadPozo } from './propiedad-pozo.entity';

@Entity('propiedades')
export class Propiedad {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 150 })
  titulo: string;

  @Column({ type: 'text', nullable: true })
  descripcion: string;

  @Column({ type: 'enum', enum: TipoPropiedad })
  tipo: TipoPropiedad;

  @Column({ type: 'enum', enum: TipoOperacion })
  operacion: TipoOperacion;

  @Column({ nullable: true, type: 'int' })
  precio: number | null;

  @Column({ length: 200 })
  direccion: string;

  @Column({ length: 120 })
  localidad: string;

  @Column({ nullable: true })
  ambientes: number;

  @Column({ nullable: true })
  dormitorios: number;

  @Column({ nullable: true })
  banos: number;

  @Column({ nullable: true })
  metrosCubiertos: number;

  @Column({ nullable: true })
  metrosTotales: number;

  @Column('simple-array', { nullable: true })
  imagenes: string[];

  @ManyToOne(() => Agencia, (agencia) => agencia.id)
  agencia: Agencia;

  @ManyToOne(() => User, (user) => user.id)
  creadoPor: User;

  // ------------------------------
  // RELACIONES CON DETALLES
  // ------------------------------

  @OneToOne(() => PropiedadCasa, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  casa: PropiedadCasa;

  @OneToOne(() => PropiedadDepartamento, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  departamento: PropiedadDepartamento;

  @OneToOne(() => PropiedadLote, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  lote: PropiedadLote;

  @OneToOne(() => PropiedadLocal, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  local: PropiedadLocal;

  @OneToOne(() => PropiedadOficina, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  oficina: PropiedadOficina;

  @OneToOne(() => PropiedadCampo, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  campo: PropiedadCampo;

  @OneToOne(() => PropiedadPH, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  ph: PropiedadPH;

  @OneToOne(() => PropiedadPozo, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  pozo: PropiedadPozo;

  @Column({ default: true })
  activo: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  creadoEn: Date;
}
