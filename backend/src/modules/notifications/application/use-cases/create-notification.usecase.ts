import { Inject, Injectable } from '@nestjs/common';
import { NotificationEntity } from '@/modules/notifications/domain/entities/notification.entity';
import { NotificationRepositoryPort } from '@/modules/notifications/domain/repositories/notification.repository.port';
import { CreateNotificationDto } from '../dto/create-notification.dto';
import { NOTIFICATION_REPOSITORY } from '../tokens';

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    @Inject(NOTIFICATION_REPOSITORY)
    private readonly repository: NotificationRepositoryPort,
  ) {}

  execute(dto: CreateNotificationDto) {
    return this.repository.save(NotificationEntity.create(dto));
  }
}
