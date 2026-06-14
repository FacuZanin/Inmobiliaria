import { NotificationType } from '@/modules/notifications/domain/enums/notification-type.enum';

export type CreateNotificationDto = {
  recipientId: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
};
