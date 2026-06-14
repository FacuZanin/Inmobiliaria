// backend/src/modules/listings/presentation/controllers/listing-owner.controller.ts

import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
} from '@nestjs/swagger';

import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';

import { Permission } from '@shared/contracts/enums/permission.enum';

import type { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';

import { CreateListingDto } from '@modules/listings/application/dto/create-listing.dto';
import { UpdateListingDto } from '@modules/listings/application/dto/update-listing.dto';

import { CreateListingUseCase } from '@modules/listings/application/use-cases/create-listing.usecase';
import { UpdateListingUseCase } from '@modules/listings/application/use-cases/update-listing.usecase';
import { PublishListingUseCase } from '@modules/listings/application/use-cases/publish-listing.usecase';
import { PauseListingUseCase } from '@modules/listings/application/use-cases/pause-listing.usecase';
import { ArchiveListingUseCase } from '@modules/listings/application/use-cases/archive-listing.usecase';
import { GetListingUseCase } from '@modules/listings/application/use-cases/get-listing.usecase';

import { ListingOwnershipPolicy } from '@modules/listings/application/policies/listing-ownership.policy';

@ApiTags('Owner Listings')
@Controller('owner/listings')
@Auth()
export class ListingOwnerController {
  constructor(
    private readonly createListingUseCase: CreateListingUseCase,

    private readonly updateListingUseCase: UpdateListingUseCase,

    private readonly publishListingUseCase: PublishListingUseCase,

    private readonly pauseListingUseCase: PauseListingUseCase,

    private readonly archiveListingUseCase: ArchiveListingUseCase,

    private readonly getListingUseCase: GetListingUseCase,

    private readonly ownershipPolicy: ListingOwnershipPolicy,
  ) {}


  @Post()
  @Auth(Permission.LISTING_CREATE)
  @ApiOperation({
    summary: 'Create listing',
  })
  async create(
    @Body()
    dto: CreateListingDto,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    return this.createListingUseCase.execute(
      dto,
      user.id ?? user.sub,
      user.agencia?.id ?? null,
    );
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get owner listing',
  })
  async getOwnListing(
    @Param('id', ParseIntPipe)
    id: number,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    const listing =
      await this.getListingUseCase.execute(
        id,
      );

    this.ownershipPolicy.assertOwnership(
      listing,
      user.id ?? user.sub,
      user.role,
    );

    return listing;
  }

  @Patch(':id')
  @Auth(Permission.LISTING_UPDATE)
  @ApiOperation({
    summary: 'Update listing',
  })
  async update(
    @Param('id', ParseIntPipe)
    id: number,

    @Body()
    dto: UpdateListingDto,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    const listing =
      await this.getListingUseCase.execute(
        id,
      );

    this.ownershipPolicy.assertOwnership(
      listing,
      user.id ?? user.sub,
      user.role,
    );

    return this.updateListingUseCase.execute(
      id,
      dto,
    );
  }

  @Post(':id/publish')
  @ApiOperation({
    summary: 'Publish listing',
  })
  async publish(
    @Param('id', ParseIntPipe)
    id: number,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    const listing =
      await this.getListingUseCase.execute(
        id,
      );

    this.ownershipPolicy.assertOwnership(
      listing,
      user.id ?? user.sub,
      user.role,
    );

    return this.publishListingUseCase.execute(
      id,
    );
  }

  @Post(':id/pause')
  @ApiOperation({
    summary: 'Pause listing',
  })
  async pause(
    @Param('id', ParseIntPipe)
    id: number,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    const listing =
      await this.getListingUseCase.execute(
        id,
      );

    this.ownershipPolicy.assertOwnership(
      listing,
      user.id ?? user.sub,
      user.role,
    );

    return this.pauseListingUseCase.execute(
      id,
    );
  }


  @Post(':id/archive')
  @ApiOperation({
    summary: 'Archive listing',
  })
  async archive(
    @Param('id', ParseIntPipe)
    id: number,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    const listing =
      await this.getListingUseCase.execute(
        id,
      );

    this.ownershipPolicy.assertOwnership(
      listing,
      user.id ?? user.sub,
      user.role,
    );

    return this.archiveListingUseCase.execute(
      id,
    );
  }

  @Delete(':id')
  @Auth(Permission.LISTING_DELETE)
  @ApiOperation({
    summary: 'Delete listing',
  })
  async delete(
    @Param('id', ParseIntPipe)
    id: number,

    @CurrentUser()
    user: JwtPayload & { id?: number },
  ) {
    const listing =
      await this.getListingUseCase.execute(
        id,
      );

    this.ownershipPolicy.assertOwnership(
      listing,
      user.id ?? user.sub,
      user.role,
    );

    await this.archiveListingUseCase.execute(
      id,
    );

    return {
      success: true,
    };
  }
}
