import { Inject, Injectable } from '@nestjs/common';
import { NotificationRepositoryPort } from '@/modules/notifications/domain/repositories/notification.repository.port';
import { NOTIFICATION_REPOSITORY } from '../tokens';

@Injectable()
export class MarkAllNotificationsReadUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  async execute(recipientId: number) {
    await this.repository.markAllAsRead(recipientId);

    return {
      success: true,
    };
  }
}
