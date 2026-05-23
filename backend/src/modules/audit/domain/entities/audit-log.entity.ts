// backend\src\modules\audit\domain\entities\audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id!: number;

  @Index()
  @Column({
    type: 'varchar',
  })
  action!: string;

  @Index()
  @Column({
    type: 'varchar',
  })
  entity!: string;

  @Index()
  @Column({
    type: 'integer',
    nullable: true,
  })
  entityId!: number | null;

  @Index()
  @Column({
    type: 'integer',
    nullable: true,
  })
  userId!: number | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  oldValue!: Record<string, any> | null;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  newValue!: Record<string, any> | null;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt!: Date;
}