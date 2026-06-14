import { Inject, Injectable } from '@nestjs/common';
import { PROPERTY_QUERY_REPOSITORY } from '../tokens';
import {
  PaginatedPropertiesResult,
  PropertyQueryRepositoryPort,
  PropertySearchFilters,
} from '../../domain/repositories/property-query.repository.port';

@Injectable()
export class SearchPropertiesUseCase {
  constructor(
    @Inject(PROPERTY_QUERY_REPOSITORY)
    private readonly propertyQueryRepository: PropertyQueryRepositoryPort,
  ) {}

  execute(filters: PropertySearchFilters): Promise<PaginatedPropertiesResult> {
    return this.propertyQueryRepository.search(filters);
  }
}
