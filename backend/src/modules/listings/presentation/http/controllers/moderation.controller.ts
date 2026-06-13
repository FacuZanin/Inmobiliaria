import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { Auth } from '@/security/decorators/auth.decorator';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { ModerateListingDto } from '@modules/listings/application/dto/moderation.dto';
import { ModerateListingUseCase } from '@modules/listings/application/use-cases/moderate-listing.usecase';
import { ListingQueryRepository } from '@modules/listings/infrastructure/repositories/listing-query.repository';

@ApiTags('Listing Moderation')
@ApiBearerAuth('access-token')
@Controller('admin/listings/moderation')
@Auth(Permission.LISTING_MODERATE)
export class ModerationController {
  constructor(
    private readonly moderateListing: ModerateListingUseCase,

    private readonly listings: ListingQueryRepository,
  ) {}

  @Get('pending')
  @ApiOperation({ summary: 'List pending listings moderation' })
  pending(@Query('page') page?: string, @Query('limit') limit?: string) {
    return this.listings.findPendingModeration({
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 20,
    });
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Moderate listing' })
  moderate(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: ModerateListingDto,
  ) {
    return this.moderateListing.execute({
      listingId: id,
      status: dto.status,
      reason: dto.reason,
    });
  }
}
