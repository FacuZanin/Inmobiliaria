import { OperacionTipo } from '@shared/contracts/enums/operacion-tipo.enum';
import { PropiedadTipo } from '@shared/contracts/enums/propiedad-tipo.enum';
import { PropertyStatus } from '@shared/contracts/enums/property-status.enum';
import { PropertyVisibility } from '../enums/property-visibility.enum';
import { PropertyAggregate } from '../aggregates/property.aggregate';

export interface PropertySearchFilters {
  query?: string;
  type?: PropiedadTipo;
  operationType?: OperacionTipo;
  status?: PropertyStatus;
  visibility?: PropertyVisibility;
  city?: string;
  ownerId?: number;
  agencyId?: number;
  minPrice?: number;
  maxPrice?: number;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'updatedAt' | 'title' | 'salePrice' | 'rentalPrice';
  order?: 'ASC' | 'DESC';
}

export interface PaginatedPropertiesResult {
  items: PropertyAggregate[];
  total: number;
  page: number;
  limit: number;
}

export abstract class PropertyQueryRepositoryPort {
  abstract search(
    filters?: PropertySearchFilters,
  ): Promise<PaginatedPropertiesResult>;
}
