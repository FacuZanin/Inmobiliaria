// backend\src\modules\publicaciones\domain\entities\publicacion.aggregate.ts
import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

type PublicacionAggregateProps = {
  id?: number | null;

  propertyId: number;

  status?: PublicacionStatus;

  visible?: boolean;

  verified?: boolean;

  featured?: boolean;

  moderationScore?: number | null;

  moderationNotes?: string | null;

  publicadoEn?: Date | null;

  creadoEn?: Date;
};

export class PublicacionAggregate {
  // ---------------------------------------------------
  // STATE
  // ---------------------------------------------------

  private _id: number | null;

  private _propertyId: number;

  private _status: PublicacionStatus;

  private _visible: boolean;

  private _verified: boolean;

  private _featured: boolean;

  private _moderationScore: number | null;

  private _moderationNotes: string | null;

  private _publicadoEn: Date | null;

  private _creadoEn?: Date;

  // ---------------------------------------------------
  // CONSTRUCTOR
  // ---------------------------------------------------

  private constructor(
    props: PublicacionAggregateProps,
  ) {
    this._id = props.id ?? null;

    this._propertyId = props.propertyId;

    this._status =
      props.status ??
      PublicacionStatus.EN_REVISION;

    this._visible = props.visible ?? true;

    this._verified = props.verified ?? false;

    this._featured = props.featured ?? false;

    this._moderationScore =
      props.moderationScore ?? null;

    this._moderationNotes =
      props.moderationNotes ?? null;

    this._publicadoEn =
      props.publicadoEn ?? null;

    this._creadoEn = props.creadoEn;
  }

  // ---------------------------------------------------
  // FACTORIES
  // ---------------------------------------------------

  static create(
    props: Omit<
      PublicacionAggregateProps,
      | 'id'
      | 'creadoEn'
      | 'publicadoEn'
      | 'status'
      | 'verified'
      | 'visible'
      | 'featured'
    >,
  ): PublicacionAggregate {
    return new PublicacionAggregate({
      ...props,

      id: null,

      status: PublicacionStatus.EN_REVISION,

      visible: true,

      verified: false,

      featured: false,

      publicadoEn: null,

      creadoEn: new Date(),
    });
  }

  static rehydrate(
    props: PublicacionAggregateProps,
  ): PublicacionAggregate {
    return new PublicacionAggregate(props);
  }

  // ---------------------------------------------------
  // GETTERS
  // ---------------------------------------------------

  get id(): number | null {
    return this._id;
  }

  get propertyId(): number {
    return this._propertyId;
  }

  get status(): PublicacionStatus {
    return this._status;
  }

  get visible(): boolean {
    return this._visible;
  }

  get verified(): boolean {
    return this._verified;
  }

  get featured(): boolean {
    return this._featured;
  }

  get moderationScore(): number | null {
    return this._moderationScore;
  }

  get moderationNotes(): string | null {
    return this._moderationNotes;
  }

  get publicadoEn(): Date | null {
    return this._publicadoEn;
  }

  get creadoEn(): Date | undefined {
    return this._creadoEn;
  }

  // ---------------------------------------------------
  // DOMAIN BEHAVIORS
  // ---------------------------------------------------

  approve() {
    this._status =
      PublicacionStatus.PUBLICADA_VERIFICADA;

    this._verified = true;

    this._visible = true;

    this._publicadoEn = new Date();
  }

  sendToReview() {
    this._status =
      PublicacionStatus.EN_REVISION;

    this._verified = false;
  }

  reject(reason?: string) {
    this._status =
      PublicacionStatus.RECHAZADA;

    this._visible = false;

    if (reason) {
      this._moderationNotes = reason;
    }
  }

  observe(reason?: string) {
    this._status =
      PublicacionStatus.OBSERVADA;

    if (reason) {
      this._moderationNotes = reason;
    }
  }

  pause() {
    this._status =
      PublicacionStatus.PAUSADA;

    this._visible = false;
  }

  restore() {
    this._status =
      PublicacionStatus.PUBLICADA_VERIFICADA;

    this._visible = true;
  }

  markAsFeatured() {
    this._featured = true;
  }

  removeFeatured() {
    this._featured = false;
  }

  hide() {
    this._visible = false;
  }

  show() {
    this._visible = true;
  }

  updateModerationScore(score: number) {
    this._moderationScore = score;
  }

  updateModerationNotes(notes: string) {
    this._moderationNotes = notes;
  }

  setId(id: number) {
    if (!this._id) {
      this._id = id;
    }
  }
}