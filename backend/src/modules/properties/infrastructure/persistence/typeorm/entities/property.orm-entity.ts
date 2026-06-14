import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agencia } from '@/modules/agencies/domain/entities/agencia.entity';
import { User } from '@/modules/users/domain/entities/user.entity';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';
import { PropertyVisibility } from '@/modules/properties/domain/enums/property-visibility.enum';

const decimalTransformer = {
  to: (value?: number | null) => value,
  from: (value?: string | null) =>
    value !== null && value !== undefined ? Number(value) : null,
};

@Entity('properties')
@Index(['status', 'visibility'])
@Index(['operationType', 'type'])
export class PropertyOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({
    type: 'varchar',
    length: 180,
  })
  title!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @Index()
  @Column({
    type: 'enum',
    enum: PropiedadTipo,
  })
  type!: PropiedadTipo;

  @Index()
  @Column({
    type: 'enum',
    enum: OperacionTipo,
  })
  operationType!: OperacionTipo;

  @Index()
  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.BORRADOR,
  })
  status!: PropertyStatus;

  @Index()
  @Column({
    type: 'enum',
    enum: PropertyVisibility,
    default: PropertyVisibility.PRIVATE,
  })
  visibility!: PropertyVisibility;

  @Column({
    type: 'varchar',
    length: 255,
  })
  street!: string;

  @Index()
  @Column({
    type: 'varchar',
    length: 120,
  })
  city!: string;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  province!: string | null;

  @Column({
    type: 'varchar',
    length: 120,
    nullable: true,
  })
  country!: string | null;

  @Column({
    type: 'varchar',
    length: 30,
    nullable: true,
  })
  postalCode!: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
    transformer: decimalTransformer,
  })
  latitude!: number | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 7,
    nullable: true,
    transformer: decimalTransformer,
  })
  longitude!: number | null;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  salePrice!: number | null;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  rentalPrice!: number | null;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: decimalTransformer,
  })
  expenses!: number | null;

  @Column({
    type: 'varchar',
    length: 10,
    default: 'ARS',
  })
  currency!: string;

  @Column({
    type: 'int',
    nullable: true,
  })
  rooms!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  bedrooms!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  bathrooms!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  coveredArea!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  totalArea!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  parkingSpaces!: number | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  age!: number | null;

  @Column({
    type: 'text',
    array: true,
    default: '{}',
  })
  amenities!: string[];

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  details!: Record<string, unknown> | null;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner!: User;

  @Index()
  @Column()
  ownerId!: number;

  @ManyToOne(() => Agencia, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  agency!: Agencia | null;

  @Index()
  @Column({
    nullable: true,
  })
  agencyId!: number | null;

  @DeleteDateColumn({
    type: 'timestamp',
    nullable: true,
  })
  deletedAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
