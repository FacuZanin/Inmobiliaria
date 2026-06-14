import { BadRequestException } from '@nestjs/common';
import { NotificationType } from '../enums/notification-type.enum';

export type NotificationProps = {
  id?: number | null;
  recipientId: number;
  type: NotificationType;
  title: string;
  body: string;
  data?: Record<string, unknown> | null;
  readAt?: Date | null;
  createdAt?: Date;
};

export class NotificationEntity {
  private _id: number | null;
  private _recipientId: number;
  private _type: NotificationType;
  private _title: string;
  private _body: string;
  private _data: Record<string, unknown> | null;
  private _readAt: Date | null;
  private _createdAt?: Date;

  private constructor(props: NotificationProps) {
    this.ensureValid(props);

    this._id = props.id ?? null;
    this._recipientId = props.recipientId;
    this._type = props.type;
    this._title = props.title;
    this._body = props.body;
    this._data = props.data ?? null;
    this._readAt = props.readAt ?? null;
    this._createdAt = props.createdAt;
  }

  static create(props: Omit<NotificationProps, 'id' | 'readAt'>) {
    return new NotificationEntity({
      ...props,
      readAt: null,
    });
  }

  static rehydrate(props: NotificationProps) {
    return new NotificationEntity(props);
  }

  get id() {
    return this._id;
  }

  get recipientId() {
    return this._recipientId;
  }

  get type() {
    return this._type;
  }

  get title() {
    return this._title;
  }

  get body() {
    return this._body;
  }

  get data() {
    return this._data;
  }

  get readAt() {
    return this._readAt;
  }

  get createdAt() {
    return this._createdAt;
  }

  get isRead() {
    return this._readAt !== null;
  }

  markAsRead() {
    if (!this._readAt) {
      this._readAt = new Date();
    }
  }

  private ensureValid(props: NotificationProps) {
    if (!props.recipientId || props.recipientId < 1) {
      throw new BadRequestException('Notification recipient is required');
    }

    if (!props.title?.trim()) {
      throw new BadRequestException('Notification title is required');
    }

    if (!props.body?.trim()) {
      throw new BadRequestException('Notification body is required');
    }
  }
}
