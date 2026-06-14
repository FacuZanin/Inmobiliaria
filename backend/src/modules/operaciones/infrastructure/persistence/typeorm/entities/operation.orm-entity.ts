import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Agencia } from '@/modules/agencies/domain/entities/agencia.entity';
import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing.orm-entity';
import { PropertyOrmEntity } from '@/modules/properties/infrastructure/persistence/typeorm/entities/property.orm-entity';
import { User } from '@/modules/users/domain/entities/user.entity';
import { OperationStatus } from '@/modules/operaciones/domain/enums/operation-status.enum';
import { RealEstateOperationType } from '@/modules/operaciones/domain/enums/real-estate-operation-type.enum';
import { OperationHistoryOrmEntity } from './operation-history.orm-entity';

@Entity('operations')
@Index(['status'])
@Index(['buyerId', 'status'])
@Index(['ownerId', 'status'])
@Index(['agencyId', 'status'])
export class OperationOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'enum',
    enum: RealEstateOperationType,
  })
  type!: RealEstateOperationType;

  @Column({
    type: 'enum',
    enum: OperationStatus,
    default: OperationStatus.PENDING,
  })
  status!: OperationStatus;

  @ManyToOne(() => ListingOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  listing!: ListingOrmEntity | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  listingId!: number | null;

  @ManyToOne(() => PropertyOrmEntity, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  property!: PropertyOrmEntity | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  propertyId!: number | null;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  buyer!: User;

  @Column({
    type: 'int',
  })
  buyerId!: number;

  @ManyToOne(() => User, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  owner!: User;

  @Column({
    type: 'int',
  })
  ownerId!: number;

  @ManyToOne(() => Agencia, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  agency!: Agencia | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  agencyId!: number | null;

  @Column({
    type: 'decimal',
    precision: 14,
    scale: 2,
    nullable: true,
    transformer: {
      to: (value?: number | null) => value,
      from: (value?: string | null) =>
        value !== null && value !== undefined ? Number(value) : null,
    },
  })
  amount!: number | null;

  @Column({
    type: 'varchar',
    length: 10,
    nullable: true,
  })
  currency!: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  message!: string | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  reservationDate!: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  finalizedAt!: Date | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  cancelledAt!: Date | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  cancellationReason!: string | null;

  @OneToMany(() => OperationHistoryOrmEntity, (history) => history.operation, {
    eager: true,
  })
  history!: OperationHistoryOrmEntity[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
