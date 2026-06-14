import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OperationStatus } from '@/modules/operaciones/domain/enums/operation-status.enum';
import { OperationOrmEntity } from './operation.orm-entity';

@Entity('operation_history')
export class OperationHistoryOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => OperationOrmEntity, (operation) => operation.history, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  operation!: OperationOrmEntity;

  @Index()
  @Column({
    type: 'int',
    nullable: true,
  })
  operationId!: number | null;

  @Column({
    type: 'enum',
    enum: OperationStatus,
    nullable: true,
  })
  fromStatus!: OperationStatus | null;

  @Column({
    type: 'enum',
    enum: OperationStatus,
  })
  toStatus!: OperationStatus;

  @Column({
    type: 'int',
  })
  changedById!: number;

  @Column({
    type: 'text',
    nullable: true,
  })
  note!: string | null;

  @CreateDateColumn()
  createdAt!: Date;
}
