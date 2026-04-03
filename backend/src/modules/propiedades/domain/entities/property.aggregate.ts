// backend\src\modules\propiedades\domain\entities\property.aggregate.ts
import type { OperationTipo } from '@shared/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/enums/propiedad-tipo.enum';

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

/**
 * Detalles válidos por tipo de propiedad
 * (Value Objects polimórficos)
 */
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
 * Props internas del Aggregate
 * (explícitas para evitar problemas con constructor privado)
 */
type PropertyAggregateProps = {
  id?: number | null;
  titulo: string;
  descripcion?: string | null;
  tipo: PropiedadTipo;
  operacion: OperationTipo;
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
 * Aggregate Root: Property
 */
export class PropertyAggregate {
  // ---------- STATE ----------
  private _id: number | null;
  private _titulo: string;
  private _descripcion: string | null;
  private _tipo: PropiedadTipo;;
  private _operacion: OperationTipo;
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

  // ---------- CONSTRUCTOR ----------
  private constructor(props: PropertyAggregateProps) {
    this._id = props.id ?? null;
    this._titulo = props.titulo;
    this._descripcion = props.descripcion ?? null;
    this._tipo = props.tipo;
    this._operacion = props.operacion;
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

  // ---------- FACTORIES ----------

  /**
   * Creación de una nueva propiedad (caso de negocio)
   */
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

  /**
   * Reconstrucción desde persistencia
   */
  static rehydrate(props: PropertyAggregateProps): PropertyAggregate {
    return new PropertyAggregate(props);
  }

  // ---------- GETTERS ----------
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

  get operacion(): OperationTipo {
    return this._operacion;
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

  // ---------- DOMAIN BEHAVIORS ----------

  updateGeneral(data: Partial<{
    titulo: string;
    descripcion: string | null;
    operacion: OperationTipo;
    precio: PriceVO | null;
    direccion: AddressVO;
    localidad: string;
    imagenes: string[];
    ambientes: number | null;
    dormitorios: number | null;
    banos: number | null;
    superficie: SuperficieVO | null;
    agenciaId: number | null;
  }>) {
    if (data.titulo !== undefined) this._titulo = data.titulo;
    if (data.descripcion !== undefined) this._descripcion = data.descripcion;
    if (data.operacion !== undefined) this._operacion = data.operacion;
    if (data.precio !== undefined) this._precio = data.precio;
    if (data.direccion !== undefined) this._direccion = data.direccion;
    if (data.localidad !== undefined) this._localidad = data.localidad;
    if (data.imagenes !== undefined) this._imagenes = data.imagenes;

    if (data.ambientes !== undefined) this._ambientes = data.ambientes;
    if (data.dormitorios !== undefined) this._dormitorios = data.dormitorios;
    if (data.banos !== undefined) this._banos = data.banos;
    if (data.superficie !== undefined) this._superficie = data.superficie;

    if (data.agenciaId !== undefined) this._agenciaId = data.agenciaId;
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
