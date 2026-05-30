// backend/src/modules/listings/domain/value-objects/features.vo.ts

type FeaturesVOProps = {
  rooms?: number | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  coveredArea?: number | null;
  totalArea?: number | null;
};

export class FeaturesVO {
  private readonly _rooms: number | null;

  private readonly _bedrooms: number | null;

  private readonly _bathrooms: number | null;

  private readonly _coveredArea: number | null;

  private readonly _totalArea: number | null;

  constructor(props: FeaturesVOProps) {
    this._rooms = props.rooms ?? null;

    this._bedrooms =
      props.bedrooms ?? null;

    this._bathrooms =
      props.bathrooms ?? null;

    this._coveredArea =
      props.coveredArea ?? null;

    this._totalArea =
      props.totalArea ?? null;
  }

  get rooms() {
    return this._rooms;
  }

  get bedrooms() {
    return this._bedrooms;
  }

  get bathrooms() {
    return this._bathrooms;
  }

  get coveredArea() {
    return this._coveredArea;
  }

  get totalArea() {
    return this._totalArea;
  }

  toPrimitives() {
    return {
      rooms: this._rooms,
      bedrooms: this._bedrooms,
      bathrooms: this._bathrooms,
      coveredArea: this._coveredArea,
      totalArea: this._totalArea,
    };
  }
}