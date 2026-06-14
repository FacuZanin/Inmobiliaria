import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { NotificationRepositoryPort } from '@/modules/notifications/domain/repositories/notification.repository.port';
import { NOTIFICATION_REPOSITORY } from '../tokens';

@Injectable()
export class MarkNotificationReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  async execute(id: number, recipientId: number) {
    const notification = await this.repository.findById(id);

    if (!notification) {
      throw new NotFoundException('Notification not found');
    }

    if (notification.recipientId !== recipientId) {
      throw new ForbiddenException('You cannot update this notification');
    }

    notification.markAsRead();

    return this.repository.save(notification);
  }
}
