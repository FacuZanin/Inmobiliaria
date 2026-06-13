import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/security/decorators/auth.decorator';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';
import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';
import { Inject } from '@nestjs/common';
import { ListingStatus } from '@modules/listings/domain/enums/listing-status.enum';
import { ModerationStatus } from '@modules/listings/domain/enums/moderation-status.enum';
import { ListingQueryRepository } from '@modules/listings/infrastructure/repositories/listing-query.repository';


@ApiTags('Admin Listings')
@ApiBearerAuth('access-token')
@Controller('admin/listings')
@Auth(Permission.LISTING_READ_PRIVATE)
export class ListingAdminController {
  constructor(
    @Inject(LISTING_REPOSITORY)
    private readonly listingRepository: ListingRepositoryPort,

    private readonly listings: ListingQueryRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Search listings as admin' })
  search(
    @Query('query') query?: string,
    @Query('status') status?: ListingStatus,
    @Query('moderationStatus') moderationStatus?: ModerationStatus,
    @Query('ownerId') ownerId?: string,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listings.searchAdmin({
      query,
      status,
      moderationStatus,
      ownerId: ownerId ? Number(ownerId) : undefined,
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get listing as admin' })
  findById(@Param('id', ParseIntPipe) id: number) {
    return this.listingRepository.findById(id);
  }
}
