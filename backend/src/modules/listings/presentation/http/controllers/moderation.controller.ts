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

import { Auth } from '@/core/shared/security/decorators/auth.decorator';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { ModerateListingDto } from '@modules/listings/application/dto/moderation.dto';
import { ModerateListingUseCase } from '@modules/listings/application/use-cases/moderate-listing.usecase';
import { ListingRepositoryPort } from '@modules/listings/domain/repositories/listing.repository.port';
import { LISTING_REPOSITORY } from '@modules/listings/application/tokens';
import { Inject } from '@nestjs/common';

@ApiTags('Listing Moderation')
@ApiBearerAuth('access-token')
@Controller('admin/listings/moderation')
@Auth(Permission.LISTING_MODERATE)
export class ModerationController {
  constructor(
    private readonly moderateListing: ModerateListingUseCase,

    @Inject(LISTING_REPOSITORY)
    private readonly listings: ListingRepositoryPort,
  ) {}

  @Get('pending')
  @ApiOperation({ summary: 'List pending listings moderation' })
  pending(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.listings.findPendingModeration(
      page ? Number(page) : 1,
      limit ? Number(limit) : 20,
    );
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
