// backend\src\modules\propiedades\infrastructure\persistence\typeorm\entities\propiedad.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  JoinColumn,
  DeleteDateColumn,
  CreateDateColumn,
} from 'typeorm';

import { Agencia } from '../../../../../agencias/domain/entities/agencia.entity';
import { User } from '../../../../../user/domain/entities/user.entity';

import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

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
  // ---------------------------------------------------
  // BASE
  // ---------------------------------------------------

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'varchar',
    length: 150,
  })
  titulo!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  descripcion!: string | null;

  @Column({
    type: 'enum',
    enum: PropiedadTipo,
  })
  tipo!: PropiedadTipo;

  @Column({
    type: 'enum',
    enum: OperacionTipo,
  })
  operacion!: OperacionTipo;

  @Column({
    type: 'int',
    nullable: true,
  })
  precio!: number | null;

  // ---------------------------------------------------
  // UBICACIÓN
  // ---------------------------------------------------

  @Column({
    type: 'varchar',
    length: 200,
  })
  direccion!: string;

  @Column({
    type: 'varchar',
    length: 120,
  })
  localidad!: string;

  // ---------------------------------------------------
  // GENERALES
  // ---------------------------------------------------

  @Column({
    type: 'int',
    nullable: true,
  })
  ambientes!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  dormitorios!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  banos!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  metrosCubiertos!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  metrosTotales!: number | null;

  @Column('simple-array', {
    nullable: true,
  })
  imagenes!: string[] | null;

  // ---------------------------------------------------
  // RELACIONES
  // ---------------------------------------------------

  @ManyToOne(() => Agencia, (agencia) => agencia.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  agencia!: Agencia | null;

  @ManyToOne(() => User, (user) => user.id, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  creadoPor!: User | null;

  // ---------------------------------------------------
  // DETALLES
  // ---------------------------------------------------

  @OneToOne(() => PropiedadCasa, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  casa!: PropiedadCasa | null;

  @OneToOne(() => PropiedadDepartamento, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  departamento!: PropiedadDepartamento | null;

  @OneToOne(() => PropiedadLote, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  lote!: PropiedadLote | null;

  @OneToOne(() => PropiedadLocal, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  local!: PropiedadLocal | null;

  @OneToOne(() => PropiedadOficina, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  oficina!: PropiedadOficina | null;

  @OneToOne(() => PropiedadCampo, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  campo!: PropiedadCampo | null;

  @OneToOne(() => PropiedadPH, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  ph!: PropiedadPH | null;

  @OneToOne(() => PropiedadPozo, (l) => l.propiedad, {
    nullable: true,
    cascade: true,
    eager: false,
  })
  @JoinColumn()
  pozo!: PropiedadPozo | null;

  // ---------------------------------------------------
  // ESTADO
  // ---------------------------------------------------

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.BORRADOR,
  })
  status!: PropertyStatus;

  @CreateDateColumn({
    type: 'timestamp',
  })
  creadoEn!: Date;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date | null;
}
