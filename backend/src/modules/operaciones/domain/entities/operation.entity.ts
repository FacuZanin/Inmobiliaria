import { BadRequestException, ConflictException } from '@nestjs/common';
import { OperationHistoryEntity } from './operation-history.entity';
import { OperationStatus } from '../enums/operation-status.enum';
import { RealEstateOperationType } from '../enums/real-estate-operation-type.enum';

export type OperationProps = {
  id?: number | null;
  type: RealEstateOperationType;
  status?: OperationStatus;
  listingId?: number | null;
  propertyId?: number | null;
  buyerId: number;
  ownerId: number;
  agencyId?: number | null;
  amount?: number | null;
  currency?: string | null;
  message?: string | null;
  reservationDate?: Date | null;
  finalizedAt?: Date | null;
  cancelledAt?: Date | null;
  cancellationReason?: string | null;
  history?: OperationHistoryEntity[];
  createdAt?: Date;
  updatedAt?: Date;
};

export class OperationEntity {
  private _id: number | null;
  private _type: RealEstateOperationType;
  private _status: OperationStatus;
  private _listingId: number | null;
  private _propertyId: number | null;
  private _buyerId: number;
  private _ownerId: number;
  private _agencyId: number | null;
  private _amount: number | null;
  private _currency: string | null;
  private _message: string | null;
  private _reservationDate: Date | null;
  private _finalizedAt: Date | null;
  private _cancelledAt: Date | null;
  private _cancellationReason: string | null;
  private _history: OperationHistoryEntity[];
  private _createdAt?: Date;
  private _updatedAt?: Date;

  private constructor(props: OperationProps) {
    this.ensureValid(props);

    this._id = props.id ?? null;
    this._type = props.type;
    this._status = props.status ?? OperationStatus.PENDING;
    this._listingId = props.listingId ?? null;
    this._propertyId = props.propertyId ?? null;
    this._buyerId = props.buyerId;
    this._ownerId = props.ownerId;
    this._agencyId = props.agencyId ?? null;
    this._amount = props.amount ?? null;
    this._currency = props.currency ?? null;
    this._message = props.message ?? null;
    this._reservationDate = props.reservationDate ?? null;
    this._finalizedAt = props.finalizedAt ?? null;
    this._cancelledAt = props.cancelledAt ?? null;
    this._cancellationReason = props.cancellationReason ?? null;
    this._history = props.history ?? [];
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;
  }

  static create(props: Omit<OperationProps, 'id' | 'status' | 'history'>) {
    const operation = new OperationEntity({
      ...props,
      status: OperationStatus.PENDING,
      history: [],
    });

    operation.addHistory(null, OperationStatus.PENDING, props.buyerId, 'Operacion creada');

    return operation;
  }

  static rehydrate(props: OperationProps) {
    return new OperationEntity(props);
  }

  get id() {
    return this._id;
  }

  get type() {
    return this._type;
  }

  get status() {
    return this._status;
  }

  get listingId() {
    return this._listingId;
  }

  get propertyId() {
    return this._propertyId;
  }

  get buyerId() {
    return this._buyerId;
  }

  get ownerId() {
    return this._ownerId;
  }

  get agencyId() {
    return this._agencyId;
  }

  get amount() {
    return this._amount;
  }

  get currency() {
    return this._currency;
  }

  get message() {
    return this._message;
  }

  get reservationDate() {
    return this._reservationDate;
  }

  get finalizedAt() {
    return this._finalizedAt;
  }

  get cancelledAt() {
    return this._cancelledAt;
  }

  get cancellationReason() {
    return this._cancellationReason;
  }

  get history() {
    return [...this._history];
  }

  get createdAt() {
    return this._createdAt;
  }

  get updatedAt() {
    return this._updatedAt;
  }

  reserve(actorId: number, note?: string | null) {
    this.transitionTo(OperationStatus.RESERVED, actorId, note);
    this._reservationDate = new Date();
  }

  startProcess(actorId: number, note?: string | null) {
    if (![OperationStatus.PENDING, OperationStatus.RESERVED].includes(this._status)) {
      throw new ConflictException('Operation cannot be moved to process');
    }

    this.transitionTo(OperationStatus.IN_PROGRESS, actorId, note);
  }

  finalize(actorId: number, note?: string | null) {
    if (![OperationStatus.RESERVED, OperationStatus.IN_PROGRESS].includes(this._status)) {
      throw new ConflictException('Operation cannot be finalized');
    }

    this.transitionTo(OperationStatus.FINALIZED, actorId, note);
    this._finalizedAt = new Date();
  }

  cancel(actorId: number, reason?: string | null) {
    if ([OperationStatus.FINALIZED, OperationStatus.CANCELLED].includes(this._status)) {
      throw new ConflictException('Operation cannot be cancelled');
    }

    this.transitionTo(OperationStatus.CANCELLED, actorId, reason);
    this._cancelledAt = new Date();
    this._cancellationReason = reason?.trim() || null;
  }

  private transitionTo(
    status: OperationStatus,
    actorId: number,
    note?: string | null,
  ) {
    const fromStatus = this._status;
    this._status = status;
    this.addHistory(fromStatus, status, actorId, note);
    this.touch();
  }

  private addHistory(
    fromStatus: OperationStatus | null,
    toStatus: OperationStatus,
    changedById: number,
    note?: string | null,
  ) {
    this._history.push(
      OperationHistoryEntity.create({
        operationId: this._id,
        fromStatus,
        toStatus,
        changedById,
        note: note ?? null,
      }),
    );
  }

  private ensureValid(props: OperationProps) {
    if (!props.listingId && !props.propertyId) {
      throw new BadRequestException('Operation requires a listing or property');
    }

    if (!props.buyerId || props.buyerId < 1) {
      throw new BadRequestException('Operation buyer is required');
    }

    if (!props.ownerId || props.ownerId < 1) {
      throw new BadRequestException('Operation owner is required');
    }

    if (props.buyerId === props.ownerId) {
      throw new ConflictException('Buyer and owner cannot be the same user');
    }

    if (props.amount != null && props.amount < 0) {
      throw new BadRequestException('Operation amount cannot be negative');
    }
  }

  private touch() {
    this._updatedAt = new Date();
  }
}
