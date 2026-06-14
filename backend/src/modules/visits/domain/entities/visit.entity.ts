import { BadRequestException, ConflictException } from '@nestjs/common';
import { VisitStatus } from '../enums/visit-status.enum';

export type VisitProps = {
  id?: number | null;
  listingId: number;
  propertyId?: number | null;
  requesterId: number;
  ownerId: number;
  agencyId?: number | null;
  desiredAt: Date;
  scheduledAt?: Date | null;
  message?: string | null;
  status?: VisitStatus;
  rejectionReason?: string | null;
  cancellationReason?: string | null;
  cancelledById?: number | null;
  createdAt?: Date;
  updatedAt?: Date;
};

export class VisitEntity {
  private _id: number | null;
  private _listingId: number;
  private _propertyId: number | null;
  private _requesterId: number;
  private _ownerId: number;
  private _agencyId: number | null;
  private _desiredAt: Date;
  private _scheduledAt: Date | null;
  private _message: string | null;
  private _status: VisitStatus;
  private _rejectionReason: string | null;
  private _cancellationReason: string | null;
  private _cancelledById: number | null;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  private constructor(props: VisitProps, enforceFutureDate = false) {
    this.ensureValid(props, enforceFutureDate);

    this._id = props.id ?? null;
    this._listingId = props.listingId;
    this._propertyId = props.propertyId ?? null;
    this._requesterId = props.requesterId;
    this._ownerId = props.ownerId;
    this._agencyId = props.agencyId ?? null;
    this._desiredAt = props.desiredAt;
    this._scheduledAt = props.scheduledAt ?? null;
    this._message = props.message ?? null;
    this._status = props.status ?? VisitStatus.PENDING;
    this._rejectionReason = props.rejectionReason ?? null;
    this._cancellationReason = props.cancellationReason ?? null;
    this._cancelledById = props.cancelledById ?? null;
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: Omit<VisitProps, 'id' | 'status'>) {
    return new VisitEntity({
      ...props,
      status: VisitStatus.PENDING,
    }, true);
  }

  static rehydrate(props: VisitProps) {
    return new VisitEntity(props);
  }

  get id() {
    return this._id;
  }

  get listingId() {
    return this._listingId;
  }

  get propertyId() {
    return this._propertyId;
  }

  get requesterId() {
    return this._requesterId;
  }

  get ownerId() {
    return this._ownerId;
  }

  get agencyId() {
    return this._agencyId;
  }

  get desiredAt() {
    return this._desiredAt;
  }

  get scheduledAt() {
    return this._scheduledAt;
  }

  get message() {
    return this._message;
  }

  get status() {
    return this._status;
  }

  get rejectionReason() {
    return this._rejectionReason;
  }

  get cancellationReason() {
    return this._cancellationReason;
  }

  get cancelledById() {
    return this._cancelledById;
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  accept(scheduledAt?: Date | null) {
    this.ensurePending('accept');

    if (scheduledAt) {
      this.ensureFutureDate(scheduledAt);
    }

    this._status = VisitStatus.ACCEPTED;
    this._scheduledAt = scheduledAt ?? this._desiredAt;
    this._rejectionReason = null;
    this.touch();
  }

  reject(reason: string) {
    this.ensurePending('reject');

    if (!reason?.trim()) {
      throw new BadRequestException('Rejection reason is required');
    }

    this._status = VisitStatus.REJECTED;
    this._rejectionReason = reason.trim();
    this.touch();
  }

  cancel(cancelledById: number, reason?: string | null) {
    if ([VisitStatus.CANCELLED, VisitStatus.DONE].includes(this._status)) {
      throw new ConflictException('Visit cannot be cancelled');
    }

    this._status = VisitStatus.CANCELLED;
    this._cancelledById = cancelledById;
    this._cancellationReason = reason?.trim() || null;
    this.touch();
  }

  reschedule(desiredAt: Date, message?: string | null) {
    if ([VisitStatus.CANCELLED, VisitStatus.DONE].includes(this._status)) {
      throw new ConflictException('Visit cannot be rescheduled');
    }

    this.ensureFutureDate(desiredAt);
    this._desiredAt = desiredAt;
    this._scheduledAt = null;
    this._status = VisitStatus.PENDING;
    this._message = message ?? this._message;
    this._rejectionReason = null;
    this.touch();
  }

  markDone() {
    if (this._status !== VisitStatus.ACCEPTED) {
      throw new ConflictException('Only accepted visits can be marked as done');
    }

    this._status = VisitStatus.DONE;
    this.touch();
  }

  private ensurePending(action: string) {
    if (this._status !== VisitStatus.PENDING) {
      throw new ConflictException(`Only pending visits can be ${action}ed`);
    }
  }

  private ensureValid(props: VisitProps, enforceFutureDate: boolean) {
    if (!props.listingId || props.listingId < 1) {
      throw new BadRequestException('Listing is required');
    }

    if (!props.requesterId || props.requesterId < 1) {
      throw new BadRequestException('Requester is required');
    }

    if (!props.ownerId || props.ownerId < 1) {
      throw new BadRequestException('Listing owner is required');
    }

    if (enforceFutureDate) {
      this.ensureFutureDate(props.desiredAt);
    }
  }

  private ensureFutureDate(date: Date) {
    if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
      throw new BadRequestException('Visit date is invalid');
    }

    if (date.getTime() <= Date.now()) {
      throw new BadRequestException('Visit date must be in the future');
    }
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
