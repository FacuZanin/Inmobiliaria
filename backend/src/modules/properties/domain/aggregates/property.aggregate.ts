import { ConflictError, ValidationError } from '@/core/shared-kernel/errors';
import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';
import { PropertyVisibility } from '../enums/property-visibility.enum';
import { PropertyAddressVO } from '../value-objects/property-address.vo';
import { PropertyCoordinatesVO } from '../value-objects/property-coordinates.vo';
import { PropertyFeaturesVO, PropertyFeaturesProps } from '../value-objects/property-features.vo';
import { PropertyPricingProps, PropertyPricingVO } from '../value-objects/property-pricing.vo';

export type PropertyAggregateProps = {
  id?: number | null;
  title: string;
  description?: string | null;
  type: PropiedadTipo;
  operationType: OperacionTipo;
  status?: PropertyStatus;
  visibility?: PropertyVisibility;
  ownerId: number;
  agencyId?: number | null;
  address: PropertyAddressVO;
  coordinates?: PropertyCoordinatesVO | null;
  pricing?: PropertyPricingVO | PropertyPricingProps;
  features?: PropertyFeaturesVO | PropertyFeaturesProps;
  amenities?: string[];
  details?: Record<string, unknown>;
  createdAt?: Date;
  updatedAt?: Date;
};

export class PropertyAggregate {
  private _id: number | null;
  private _title: string;
  private _description: string | null;
  private _type: PropiedadTipo;
  private _operationType: OperacionTipo;
  private _status: PropertyStatus;
  private _visibility: PropertyVisibility;
  private _ownerId: number;
  private _agencyId: number | null;
  private _address: PropertyAddressVO;
  private _coordinates: PropertyCoordinatesVO | null;
  private _pricing: PropertyPricingVO;
  private _features: PropertyFeaturesVO;
  private _amenities: string[];
  private _details: Record<string, unknown>;
  private _createdAt?: Date;
  private _updatedAt?: Date;

  private constructor(props: PropertyAggregateProps) {
    this._id = props.id ?? null;
    this._title = props.title;
    this._description = props.description ?? null;
    this._type = props.type;
    this._operationType = props.operationType;
    this._status = props.status ?? PropertyStatus.BORRADOR;
    this._visibility = props.visibility ?? PropertyVisibility.PRIVATE;
    this._ownerId = props.ownerId;
    this._agencyId = props.agencyId ?? null;
    this._address = props.address;
    this._coordinates = props.coordinates ?? null;
    this._pricing =
      props.pricing instanceof PropertyPricingVO
        ? props.pricing
        : new PropertyPricingVO(props.pricing ?? {});
    this._features =
      props.features instanceof PropertyFeaturesVO
        ? props.features
        : new PropertyFeaturesVO(props.features ?? {});
    this._amenities = props.amenities ?? [];
    this._details = props.details ?? {};
    this._createdAt = props.createdAt;
    this._updatedAt = props.updatedAt;

    this.validate();
  }

  static create(props: PropertyAggregateProps): PropertyAggregate {
    return new PropertyAggregate({
      ...props,
      status: props.status ?? PropertyStatus.BORRADOR,
      visibility: props.visibility ?? PropertyVisibility.PRIVATE,
    });
  }

  static rehydrate(props: PropertyAggregateProps): PropertyAggregate {
    return new PropertyAggregate(props);
  }

  get id(): number | null {
    return this._id;
  }

  get title(): string {
    return this._title;
  }

  get description(): string | null {
    return this._description;
  }

  get type(): PropiedadTipo {
    return this._type;
  }

  get operationType(): OperacionTipo {
    return this._operationType;
  }

  get status(): PropertyStatus {
    return this._status;
  }

  get visibility(): PropertyVisibility {
    return this._visibility;
  }

  get ownerId(): number {
    return this._ownerId;
  }

  get agencyId(): number | null {
    return this._agencyId;
  }

  get address(): PropertyAddressVO {
    return this._address;
  }

  get coordinates(): PropertyCoordinatesVO | null {
    return this._coordinates;
  }

  get pricing(): PropertyPricingVO {
    return this._pricing;
  }

  get features(): PropertyFeaturesVO {
    return this._features;
  }

  get amenities(): string[] {
    return [...this._amenities];
  }

  get details(): Record<string, unknown> {
    return { ...this._details };
  }

  get createdAt(): Date | undefined {
    return this._createdAt;
  }

  get updatedAt(): Date | undefined {
    return this._updatedAt;
  }

  assignPersistenceId(id: number): void {
    if (this._id !== null) {
      throw new ConflictError('Property already has a persistence id');
    }

    this._id = id;
  }

  updateBasicInfo(data: {
    title?: string;
    description?: string | null;
    type?: PropiedadTipo;
    operationType?: OperacionTipo;
  }): void {
    if (data.title !== undefined) this._title = data.title;
    if (data.description !== undefined) this._description = data.description;
    if (data.type !== undefined) this._type = data.type;
    if (data.operationType !== undefined) this._operationType = data.operationType;
    this.touch();
    this.validate();
  }

  updateLocation(data: {
    address?: PropertyAddressVO;
    coordinates?: PropertyCoordinatesVO | null;
  }): void {
    if (data.address !== undefined) this._address = data.address;
    if (data.coordinates !== undefined) this._coordinates = data.coordinates;
    this.touch();
  }

  updatePricing(pricing: PropertyPricingProps): void {
    this._pricing = new PropertyPricingVO({
      ...this._pricing.toPrimitives(),
      ...pricing,
    });
    this.touch();
  }

  updateFeatures(features: PropertyFeaturesProps): void {
    this._features = new PropertyFeaturesVO({
      ...this._features.toPrimitives(),
      ...features,
    });
    this.touch();
  }

  updateAmenities(amenities: string[]): void {
    this._amenities = [...new Set(amenities.map((item) => item.trim()).filter(Boolean))];
    this.touch();
  }

  updateDetails(details: Record<string, unknown>): void {
    this._details = {
      ...this._details,
      ...details,
    };
    this.touch();
  }

  makePublic(): void {
    this._visibility = PropertyVisibility.PUBLIC;
    this.touch();
  }

  makePrivate(): void {
    this._visibility = PropertyVisibility.PRIVATE;
    this.touch();
  }

  changeStatus(status: PropertyStatus): void {
    if (this._status === PropertyStatus.VENDIDA && status === PropertyStatus.PUBLICADA) {
      throw new ConflictError('Sold properties cannot be published again');
    }

    if (this._status === PropertyStatus.ALQUILADA && status === PropertyStatus.PUBLICADA) {
      throw new ConflictError('Rented properties cannot be published again');
    }

    this._status = status;
    this.touch();
  }

  toPrimitives() {
    return {
      id: this._id,
      title: this._title,
      description: this._description,
      type: this._type,
      operationType: this._operationType,
      status: this._status,
      visibility: this._visibility,
      ownerId: this._ownerId,
      agencyId: this._agencyId,
      address: this._address.toPrimitives(),
      coordinates: this._coordinates
        ? {
            latitude: this._coordinates.latitude,
            longitude: this._coordinates.longitude,
          }
        : null,
      pricing: this._pricing.toPrimitives(),
      features: this._features.toPrimitives(),
      amenities: this.amenities,
      details: this.details,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }

  private validate(): void {
    if (!this._title?.trim()) {
      throw new ValidationError('Property title is required');
    }

    if (!this._ownerId) {
      throw new ValidationError('Property owner is required');
    }
  }

  private touch(): void {
    this._updatedAt = new Date();
  }
}
