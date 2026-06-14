import { OperationStatus } from '../enums/operation-status.enum';

export type OperationHistoryProps = {
  id?: number | null;
  operationId?: number | null;
  fromStatus?: OperationStatus | null;
  toStatus: OperationStatus;
  changedById: number;
  note?: string | null;
  createdAt?: Date;
};

export class OperationHistoryEntity {
  constructor(private readonly props: OperationHistoryProps) {}

  static create(props: Omit<OperationHistoryProps, 'id' | 'createdAt'>) {
    return new OperationHistoryEntity(props);
  }

  static rehydrate(props: OperationHistoryProps) {
    return new OperationHistoryEntity(props);
  }

  get id() {
    return this.props.id ?? null;
  }

  get operationId() {
    return this.props.operationId ?? null;
  }

  get fromStatus() {
    return this.props.fromStatus ?? null;
  }

  get toStatus() {
    return this.props.toStatus;
  }

  get changedById() {
    return this.props.changedById;
  }

  get note() {
    return this.props.note ?? null;
  }

  get createdAt() {
    return this.props.createdAt;
  }
}
