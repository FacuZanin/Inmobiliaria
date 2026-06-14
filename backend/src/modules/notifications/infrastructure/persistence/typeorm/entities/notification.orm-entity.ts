import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { NotificationType } from '@/modules/notifications/domain/enums/notification-type.enum';

@Entity('notifications')
@Index(['recipientId', 'readAt'])
export class NotificationOrmEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: 'int',
  })
  recipientId!: number;

  @Column({
    type: 'enum',
    enum: NotificationType,
  })
  type!: NotificationType;

  @Column({
    type: 'varchar',
    length: 180,
  })
  title!: string;

  @Column({
    type: 'text',
  })
  body!: string;

  @Column({
    type: 'jsonb',
    nullable: true,
  })
  data!: Record<string, unknown> | null;

  @Column({
    type: 'timestamp',
    nullable: true,
  })
  readAt!: Date | null;

  @CreateDateColumn()
  createdAt!: Date;
}
