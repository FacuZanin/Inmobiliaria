// backend/src/modules/propiedades/domain/entities/property.aggregate.ts

import type { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';

import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';

import { PublicacionStatus } from '@shared/contracts/enums/publicacion-status.enum';

import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';

import { AddressVO } from '../value-objects/address.vo';
import { PriceVO } from '../value-objects/price.vo';
import { SuperficieVO } from '../value-objects/superficie.vo';

import {
  CasaDetails,
  DepartamentoDetails,
  LoteDetails,
  LocalDetails,
  OficinaDetails,
  CampoDetails,
  PHDetails,
  PozoDetails,
} from '../details';

export type PropertyDetails =
  | CasaDetails
  | DepartamentoDetails
  | LoteDetails
  | LocalDetails
  | OficinaDetails
  | CampoDetails
  | PHDetails
  | PozoDetails;

/**
 * ============================================================
 * PROPS INTERNAS DEL AGGREGATE
 * ============================================================
 */

type PropertyAggregateProps = {
  id?: number | null;

  titulo: string;

  descripcion?: string | null;

  tipo: PropiedadTipo;

  operacion: OperacionTipo;

  // ==========================================================
  // STATUS COMERCIAL
  // ==========================================================

  status?: PropertyStatus;

  // ==========================================================
  // STATUS DE MODERACIÓN / VALIDACIÓN
  // ==========================================================

  moderationStatus?: PublicacionStatus;

  precio?: PriceVO | null;

  direccion: AddressVO;

  localidad: string;

  imagenes?: string[];

  creadoPorId?: number | null;

  activo?: boolean;

  creadoEn?: Date;

  ambientes?: number | null;

  dormitorios?: number | null;

  banos?: number | null;

  superficie?: SuperficieVO | null;

  agenciaId?: number | null;

  detalles?: PropertyDetails;
};

/**
 * ============================================================
 * AGGREGATE ROOT: PROPERTY / LISTING
 * ============================================================
 */

export class PropertyAggregate {
  // ==========================================================
  // STATE
  // ==========================================================

  private _id: number | null;

  private _titulo: string;

  private _descripcion: string | null;

  private _tipo: PropiedadTipo;

  private _operacion: OperacionTipo;

  // ==========================================================
  // STATUS COMERCIAL
  // ==========================================================

  private _status: PropertyStatus;

  // ==========================================================
  // STATUS MODERACIÓN
  // ==========================================================

  private _moderationStatus: PublicacionStatus;

  private _precio: PriceVO | null;

  private _direccion: AddressVO;

  private _localidad: string;

  private _imagenes: string[];

  private _creadoPorId: number | null;

  private _activo: boolean;

  private _creadoEn?: Date;

  private _ambientes: number | null;

  private _dormitorios: number | null;

  private _banos: number | null;

  private _superficie: SuperficieVO | null;

  private _agenciaId: number | null;

  private _detalles?: PropertyDetails;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  private constructor(props: PropertyAggregateProps) {
    this._id = props.id ?? null;

    this._titulo = props.titulo;

    this._descripcion = props.descripcion ?? null;

    this._tipo = props.tipo;

    this._operacion = props.operacion;

    // ========================================================
    // STATUS COMERCIAL
    // ========================================================

    this._status = props.status ?? PropertyStatus.PUBLICADA;

    // ========================================================
    // STATUS MODERACIÓN
    // ========================================================

    this._moderationStatus =
      props.moderationStatus ?? PublicacionStatus.EN_REVISION;

    this._precio = props.precio ?? null;

    this._direccion = props.direccion;

    this._localidad = props.localidad;

    this._imagenes = props.imagenes ?? [];

    this._creadoPorId = props.creadoPorId ?? null;

    this._activo = props.activo ?? true;

    this._creadoEn = props.creadoEn;

    this._ambientes = props.ambientes ?? null;

    this._dormitorios = props.dormitorios ?? null;

    this._banos = props.banos ?? null;

    this._superficie = props.superficie ?? null;

    this._agenciaId = props.agenciaId ?? null;

    this._detalles = props.detalles;
  }

  // ==========================================================
  // FACTORIES
  // ==========================================================

  static create(
    props: Omit<PropertyAggregateProps, 'id' | 'activo' | 'creadoEn'>,
  ): PropertyAggregate {
    return new PropertyAggregate({
      ...props,
      id: null,
      activo: true,
      creadoEn: new Date(),
    });
  }

  static rehydrate(props: PropertyAggregateProps): PropertyAggregate {
    return new PropertyAggregate(props);
  }

  // ==========================================================
  // GETTERS
  // ==========================================================

  get id(): number | null {
    return this._id;
  }

  get titulo(): string {
    return this._titulo;
  }

  get descripcion(): string | null {
    return this._descripcion;
  }

  get tipo(): PropiedadTipo {
    return this._tipo;
  }

  get operacion(): OperacionTipo {
    return this._operacion;
  }

  // ==========================================================
  // STATUS COMERCIAL
  // ==========================================================

  get status(): PropertyStatus {
    return this._status;
  }

  // ==========================================================
  // STATUS MODERACIÓN
  // ==========================================================

  get moderationStatus(): PublicacionStatus {
    return this._moderationStatus;
  }

  get precio(): number | null {
    return this._precio?.value ?? null;
  }

  get direccion(): AddressVO {
    return this._direccion;
  }

  get localidad(): string {
    return this._localidad;
  }

  get imagenes(): string[] {
    return this._imagenes;
  }

  get creadoPorId(): number | null {
    return this._creadoPorId;
  }

  get activo(): boolean {
    return this._activo;
  }

  get creadoEn(): Date | undefined {
    return this._creadoEn;
  }

  get ambientes(): number | null {
    return this._ambientes;
  }

  get dormitorios(): number | null {
    return this._dormitorios;
  }

  get banos(): number | null {
    return this._banos;
  }

  get superficie(): SuperficieVO | null {
    return this._superficie;
  }

  get agenciaId(): number | null {
    return this._agenciaId;
  }

  get detalles(): PropertyDetails | undefined {
    return this._detalles;
  }

  // ==========================================================
  // MODERATION METHODS
  // ==========================================================
  
  pause() {
    this._status = PropertyStatus.PAUSADA;
  }

  approve() {
    this._moderationStatus = PublicacionStatus.PUBLICADA_VERIFICADA;
  }

  observe(reason?: string) {
    this._moderationStatus = PublicacionStatus.OBSERVADA;
  }

  reject(reason?: string) {
    this._moderationStatus = PublicacionStatus.RECHAZADA;
  }

  markAsUnderReview() {
    this._moderationStatus = PublicacionStatus.EN_REVISION;
  }

  // ==========================================================
  // DOMAIN BEHAVIORS
  // ==========================================================

  updateGeneral(
    data: Partial<{
      titulo: string;

      descripcion: string | null;

      operacion: OperacionTipo;

      status: PropertyStatus;

      moderationStatus: PublicacionStatus;

      precio: PriceVO | null;

      direccion: AddressVO;

      localidad: string;

      imagenes: string[];

      ambientes: number | null;

      dormitorios: number | null;

      banos: number | null;

      superficie: SuperficieVO | null;

      agenciaId: number | null;
    }>,
  ) {
    if (data.titulo !== undefined) {
      this._titulo = data.titulo;
    }

    if (data.descripcion !== undefined) {
      this._descripcion = data.descripcion;
    }

    if (data.operacion !== undefined) {
      this._operacion = data.operacion;
    }

    if (data.status !== undefined) {
      this._status = data.status;
    }

    if (data.moderationStatus !== undefined) {
      this._moderationStatus = data.moderationStatus;
    }

    if (data.precio !== undefined) {
      this._precio = data.precio;
    }

    if (data.direccion !== undefined) {
      this._direccion = data.direccion;
    }

    if (data.localidad !== undefined) {
      this._localidad = data.localidad;
    }

    if (data.imagenes !== undefined) {
      this._imagenes = data.imagenes;
    }

    if (data.ambientes !== undefined) {
      this._ambientes = data.ambientes;
    }

    if (data.dormitorios !== undefined) {
      this._dormitorios = data.dormitorios;
    }

    if (data.banos !== undefined) {
      this._banos = data.banos;
    }

    if (data.superficie !== undefined) {
      this._superficie = data.superficie;
    }

    if (data.agenciaId !== undefined) {
      this._agenciaId = data.agenciaId;
    }
  }

  setDetalles(detalles: PropertyDetails) {
    this._detalles = detalles;
  }

  setId(id: number) {
    if (!this._id) {
      this._id = id;
    }
  }
}
