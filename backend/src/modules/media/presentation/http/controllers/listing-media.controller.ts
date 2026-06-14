import {
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { UploadListingMediaDto } from '@/modules/media/application/dto/upload-listing-media.dto';
import { ReorderListingMediaDto } from '@/modules/media/application/dto/reorder-listing-media.dto';
import { DeleteListingMediaUseCase } from '@/modules/media/application/use-cases/delete-listing-media.usecase';
import { ReorderListingMediaUseCase } from '@/modules/media/application/use-cases/reorder-listing-media.usecase';
import { SetPrimaryListingMediaUseCase } from '@/modules/media/application/use-cases/set-primary-listing-media.usecase';
import { UploadListingMediaUseCase } from '@/modules/media/application/use-cases/upload-listing-media.usecase';

@Controller('owner/listings/:listingId/media')
@Auth()
export class ListingMediaController {
  constructor(
    private readonly uploadListingMedia: UploadListingMediaUseCase,
    private readonly reorderListingMedia: ReorderListingMediaUseCase,
    private readonly setPrimaryListingMedia: SetPrimaryListingMediaUseCase,
    private readonly deleteListingMedia: DeleteListingMediaUseCase,
  ) {}

  @Post()
  @Auth(Permission.LISTING_MEDIA_UPLOAD)
  @UseInterceptors(FileInterceptor('file'))
  upload(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() dto: UploadListingMediaDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    return this.uploadListingMedia.execute({
      listingId,
      file,
      user,
      isPrimary: dto.isPrimary,
    });
  }

  @Patch('order')
  @Auth(Permission.LISTING_UPDATE)
  reorder(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Body() dto: ReorderListingMediaDto,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    return this.reorderListingMedia.execute(listingId, dto.items, user);
  }

  @Patch(':mediaId/primary')
  @Auth(Permission.LISTING_UPDATE)
  setPrimary(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    return this.setPrimaryListingMedia.execute(listingId, mediaId, user);
  }

  @Delete(':mediaId')
  @Auth(Permission.LISTING_MEDIA_DELETE)
  delete(
    @Param('listingId', ParseIntPipe) listingId: number,
    @Param('mediaId', ParseIntPipe) mediaId: number,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    return this.deleteListingMedia.execute(listingId, mediaId, user);
  }
}
