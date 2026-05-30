// backend/src/modules/listings/domain/value-objects/listing-features.vo.ts

type ListingFeaturesProps = {
  rooms?: number | null;

  bedrooms?: number | null;

  bathrooms?: number | null;

  coveredArea?: number | null;

  totalArea?: number | null;

  details?: Record<string, any>;
};

export class ListingFeaturesVO {
  readonly rooms: number | null;

  readonly bedrooms: number | null;

  readonly bathrooms: number | null;

  readonly coveredArea: number | null;

  readonly totalArea: number | null;

  readonly details: Record<string, any>;

  constructor(props: ListingFeaturesProps) {
    this.rooms = props.rooms ?? null;

    this.bedrooms =
      props.bedrooms ?? null;

    this.bathrooms =
      props.bathrooms ?? null;

    this.coveredArea =
      props.coveredArea ?? null;

    this.totalArea =
      props.totalArea ?? null;

    this.details =
      props.details ?? {};
  }
}