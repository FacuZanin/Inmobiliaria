// backend/src/modules/listings/presentation/controllers/listing-public.controller.ts

import {
  Controller,
  Get,
  Param,
  Query,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

import { Public } from '@/core/shared/security/decorators/public.decorator';

import { GetListingUseCase } from '@modules/listings/application/use-cases/get-listing.usecase';
import { SearchListingsUseCase } from '@modules/listings/application/use-cases/search-listings.usecase';

import { OperationType } from '@modules/listings/domain/enums/operation-type.enum';
import { PropertyType } from '@modules/listings/domain/enums/property-type.enum';

@ApiTags('Public Listings')
@Controller('listings')
export class ListingPublicController {
  constructor(
    private readonly getListingUseCase: GetListingUseCase,

    private readonly searchListingsUseCase: SearchListingsUseCase,
  ) {}

  @Public()
  @Get(':id')
  @ApiOperation({
    summary: 'Get public listing by id',
  })
  @ApiOkResponse({
    description: 'Listing found',
  })
  async findById(
    @Param('id', ParseIntPipe)
    id: number,
  ) {
    return this.getListingUseCase.execute(
      id,
    );
  }

  @Public()
  @Get()
  @ApiOperation({
    summary: 'Search listings',
  })
  @ApiOkResponse({
    description:
      'Listings search result',
  })
  async search(
    @Query('query')
    query?: string,

    @Query('city')
    city?: string,

    @Query('operationType')
    operationType?: OperationType,

    @Query('propertyType')
    propertyType?: PropertyType,

    @Query('minPrice')
    minPrice?: number,

    @Query('maxPrice')
    maxPrice?: number,

    @Query('bedrooms')
    bedrooms?: number,

    @Query('bathrooms')
    bathrooms?: number,

    @Query('page')
    page?: number,

    @Query('limit')
    limit?: number,
  ) {
    return this.searchListingsUseCase.execute(
      {
        query,
        city,
        operationType,
        propertyType,

        minPrice:
          minPrice != null
            ? Number(minPrice)
            : undefined,

        maxPrice:
          maxPrice != null
            ? Number(maxPrice)
            : undefined,

        bedrooms:
          bedrooms != null
            ? Number(bedrooms)
            : undefined,

        bathrooms:
          bathrooms != null
            ? Number(bathrooms)
            : undefined,

        page:
          page != null
            ? Number(page)
            : 1,

        limit:
          limit != null
            ? Number(limit)
            : 20,
      },
    );
  }
}
