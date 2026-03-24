// backend\src\modules\audit\domain\entities\audit-log.entity.ts
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('audit_logs')
export class AuditLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  action: string;

  @Column()
  entity: string;

  @Column({ nullable: true })
  entityId: number;

  @Column({ nullable: true })
  userId: number;

  @Column({ type: 'json', nullable: true })
  oldValue: any;

  @Column({ type: 'json', nullable: true })
  newValue: any;

  @CreateDateColumn()
  createdAt: Date;
}
