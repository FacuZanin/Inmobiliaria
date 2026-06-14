import { NotificationEntity } from '../entities/notification.entity';

export abstract class NotificationRepositoryPort {
  abstract save(notification: NotificationEntity): Promise<NotificationEntity>;
  abstract findById(id: number): Promise<NotificationEntity | null>;
  abstract findByRecipient(recipientId: number): Promise<NotificationEntity[]>;
  abstract markAllAsRead(recipientId: number): Promise<void>;
}
