import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Auth } from '@/security/decorators/auth.decorator';
import { CurrentUser } from '@/security/decorators/current-user.decorator';
import { JwtPayload } from '@/modules/auth/application/contracts/jwt-payload.contracts';
import { Permission } from '@shared/contracts/enums/permission.enum';
import { UploadMediaDto } from '@/modules/media/application/dto/upload-media.dto';
import { UploadMediaUseCase } from '@/modules/media/application/use-cases/upload-media.usecase';
import { GetMediaUseCase } from '@/modules/media/application/use-cases/get-media.usecase';
import { DeleteMediaUseCase } from '@/modules/media/application/use-cases/delete-media.usecase';
import { MediaAssetPresenter } from '../presenters/media-asset.presenter';

@Controller('media')
@Auth()
export class MediaController {
  constructor(
    private readonly uploadMedia: UploadMediaUseCase,
    private readonly getMedia: GetMediaUseCase,
    private readonly deleteMedia: DeleteMediaUseCase,
  ) {}

  @Post()
  @Auth(Permission.UPLOAD_CREATE)
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @Body() dto: UploadMediaDto,
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    const asset = await this.uploadMedia.execute({
      ...dto,
      uploadedById: user.id ?? user.sub,
      file,
    });

    return MediaAssetPresenter.toHttp(asset);
  }

  @Get(':id')
  @Auth(Permission.UPLOAD_READ)
  async get(@Param('id', ParseIntPipe) id: number) {
    const asset = await this.getMedia.execute(id);

    return MediaAssetPresenter.toHttp(asset);
  }

  @Delete(':id')
  @Auth(Permission.UPLOAD_DELETE)
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload & { id?: number },
  ) {
    return this.deleteMedia.execute(id, user.id ?? user.sub);
  }
}
