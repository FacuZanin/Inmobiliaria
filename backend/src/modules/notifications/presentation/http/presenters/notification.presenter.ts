import { NotificationEntity } from '@/modules/notifications/domain/entities/notification.entity';

export class NotificationPresenter {
  static toHttp(notification: NotificationEntity) {
    return {
      id: notification.id,
      recipientId: notification.recipientId,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      data: notification.data,
      readAt: notification.readAt,
      isRead: notification.isRead,
      createdAt: notification.createdAt,
    };
  }

  static collection(notifications: NotificationEntity[]) {
    return notifications.map((notification) => this.toHttp(notification));
  }
}
