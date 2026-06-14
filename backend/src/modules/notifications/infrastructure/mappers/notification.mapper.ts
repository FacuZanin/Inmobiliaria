import { NotificationEntity } from '@/modules/notifications/domain/entities/notification.entity';
import { NotificationOrmEntity } from '../persistence/typeorm/entities/notification.orm-entity';

export class NotificationMapper {
  static toDomain(entity: NotificationOrmEntity): NotificationEntity {
    return NotificationEntity.rehydrate({
      id: entity.id,
      recipientId: entity.recipientId,
      type: entity.type,
      title: entity.title,
      body: entity.body,
      data: entity.data,
      readAt: entity.readAt,
      createdAt: entity.createdAt,
    });
  }

  static toOrm(notification: NotificationEntity): NotificationOrmEntity {
    const entity = new NotificationOrmEntity();

    entity.id = notification.id ?? undefined!;
    entity.recipientId = notification.recipientId;
    entity.type = notification.type;
    entity.title = notification.title;
    entity.body = notification.body;
    entity.data = notification.data;
    entity.readAt = notification.readAt;

    return entity;
  }
}
