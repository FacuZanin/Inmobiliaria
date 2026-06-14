import { Inject, Injectable } from '@nestjs/common';
import { NotificationRepositoryPort } from '@/modules/notifications/domain/repositories/notification.repository.port';
import { NOTIFICATION_REPOSITORY } from '../tokens';

@Injectable()
export class ListMyNotificationsUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  execute(recipientId: number) {
    return this.repository.findByRecipient(recipientId);
  }
}
