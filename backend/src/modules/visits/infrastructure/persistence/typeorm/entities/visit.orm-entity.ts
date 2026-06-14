import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '@/modules/users/domain/entities/user.entity';
import { Agencia } from '@/modules/agencies/domain/entities/agencia.entity';
import { ListingOrmEntity } from '@/modules/listings/infrastructure/persistence/typeorm/entities/listing.orm-entity';
import { PropertyOrmEntity } from '@/modules/properties/infrastructure/persistence/typeorm/entities/property.orm-entity';
import { VisitStatus } from '@/modules/visits/domain/enums/visit-status.enum';

@Entity('visits')
@Index(['listingId', 'status'])
@Index(['requesterId', 'status'])
@Index(['ownerId', 'status'])
@Index(['agencyId', 'status'])
export class VisitOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => ListingOrmEntity, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  listing!: ListingOrmEntity;

  @Column({
    type: 'int',
  })
  listingId!: number;

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
  requester!: User;

  @Column({
    type: 'int',
  })
  requesterId!: number;

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
    type: 'timestamp',
  })
  desiredAt!: Date;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  scheduledAt!: Date | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  message!: string | null;

  @Column({
    type: 'enum',
    enum: VisitStatus,
    default: VisitStatus.PENDING,
  })
  status!: VisitStatus;

  @Column({
    type: 'text',
    nullable: true,
  })
  rejectionReason!: string | null;

  @Column({
    type: 'text',
    nullable: true,
  })
  cancellationReason!: string | null;

  @Column({
    type: 'int',
    nullable: true,
  })
  cancelledById!: number | null;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
