import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DocumentsModule } from '@/modules/documents/documents.module';
import { NOTIFICATION_REPOSITORY } from './application/tokens';
import { CreateNotificationUseCase } from './application/use-cases/create-notification.usecase';
import { ListMyNotificationsUseCase } from './application/use-cases/list-my-notifications.usecase';
import { MarkAllNotificationsReadUseCase } from './application/use-cases/mark-all-notifications-read.usecase';
import { MarkNotificationReadUseCase } from './application/use-cases/mark-notification-read.usecase';
import { NotificationEventsSubscriber } from './infrastructure/events/notification-events.subscriber';
import { NotificationOrmEntity } from './infrastructure/persistence/typeorm/entities/notification.orm-entity';
import { NotificationTypeOrmRepository } from './infrastructure/persistence/typeorm/repositories/notification.typeorm.repository';
import { NotificationsController } from './presentation/http/controllers/notifications.controller';

@Module({
  imports: [DocumentsModule, TypeOrmModule.forFeature([NotificationOrmEntity])],
  controllers: [NotificationsController],
  providers: [
    CreateNotificationUseCase,
    ListMyNotificationsUseCase,
    MarkNotificationReadUseCase,
    MarkAllNotificationsReadUseCase,
    NotificationEventsSubscriber,
    {
      provide: NOTIFICATION_REPOSITORY,
      useClass: NotificationTypeOrmRepository,
    },
  ],
  exports: [CreateNotificationUseCase, NOTIFICATION_REPOSITORY],
})
export class NotificationsModule {}
