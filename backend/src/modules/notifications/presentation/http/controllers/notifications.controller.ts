import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
} from '@nestjs/common';
import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { ListMyNotificationsUseCase } from '@/modules/notifications/application/use-cases/list-my-notifications.usecase';
import { MarkAllNotificationsReadUseCase } from '@/modules/notifications/application/use-cases/mark-all-notifications-read.usecase';
import { MarkNotificationReadUseCase } from '@/modules/notifications/application/use-cases/mark-notification-read.usecase';
import { NotificationPresenter } from '../presenters/notification.presenter';

@Controller('notifications')
@Auth()
export class NotificationsController {
  constructor(
    private readonly listMyNotifications: ListMyNotificationsUseCase,
    private readonly markNotificationRead: MarkNotificationReadUseCase,
    private readonly markAllNotificationsRead: MarkAllNotificationsReadUseCase,
  ) {}

  @Get()
  async list(@CurrentUser() user: JwtPayload & { id?: number }) {
    const notifications = await this.listMyNotifications.execute(
      user.id ?? user.sub,
    );

    return NotificationPresenter.collection(notifications);
  }

  @Patch('read-all')
  markAllRead(@CurrentUser() user: JwtPayload & { id?: number }) {
    return this.markAllNotificationsRead.execute(user.id ?? user.sub);
  }

  @Patch(':id/read')
  async markRead(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const notification = await this.markNotificationRead.execute(
      id,
      user.id ?? user.sub,
    );

    return NotificationPresenter.toHttp(notification);
  }
}
